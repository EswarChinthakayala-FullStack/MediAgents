import os
import sys
import pandas as pd
from typing import List, Dict, Any
from .models import AnalyticsRequest, AnalyticsReport, DiseaseTrend, RiskCohort, DeIdentifiedRecord

# Add parent path for LLM
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))
from llm_engine import TinyLlamaEngine

class AnalyticsEngine:
    def __init__(self):
        self.llm = TinyLlamaEngine()

    def generate_report(self, request: AnalyticsRequest) -> AnalyticsReport:
        if not request.records:
            return self._empty_report(request.date_range)

        # 1. Load data into Pandas for aggregation
        data = [r.dict() for r in request.records]
        df = pd.DataFrame(data)

        # 2. Disease incidence trends
        # Flat list of all diagnoses
        all_diagnoses = [diag for sublist in df['diagnoses'] for diag in sublist]
        diag_counts = pd.Series(all_diagnoses).value_counts()
        top_diseases = [
            DiseaseTrend(
                condition=name,
                count=int(count),
                incidence_rate=float(count / len(df) * 100)
            ) for name, count in diag_counts.head(5).items()
        ]

        # 3. High-risk group identification
        risk_by_age = df.groupby('age_group')['risk_score'].mean().sort_values(ascending=False)
        high_risk_cohorts = [
            RiskCohort(demographic=f"Age Group: {age}", average_risk=float(score))
            for age, score in risk_by_age.items()
        ]

        # 4. Outcome statistics
        outcome_summary = df['outcome'].value_counts().to_dict()

        # 5. LLM Narrative Insight
        briefing = self._generate_executive_briefing(request, top_diseases, high_risk_cohorts, outcome_summary)

        return AnalyticsReport(
            report_period=request.date_range,
            total_patients_analyzed=len(df),
            top_diseases=top_diseases,
            high_risk_demographics=high_risk_cohorts,
            outcome_summary=outcome_summary,
            executive_briefing=briefing
        )

    def _generate_executive_briefing(self, req, diseases, cohorts, outcomes) -> str:
        disease_str = ", ".join([f"{d.condition} ({d.incidence_rate:.1f}%)" for d in diseases])
        risk_str = ", ".join([f"{c.demographic} (Avg Risk: {c.average_risk:.2f})" for c in cohorts[:2]])
        
        prompt = f"""<|system|>
You are a public health analytics AI. Given the following aggregated, de-identified clinic data for period {req.date_range}, identify:
1. Top disease trends.
2. Demographic groups with highest risk.
3. Outcome summary.
Present findings as a concise executive briefing.
</s>
<|user|>
Data Summary:
- Total Patients: {len(req.records)}
- Disease Incidence: {disease_str}
- High-Risk Groups: {risk_str}
- Outcomes: {outcomes}
</s>
<|assistant|>
"""
        try:
            self.llm.load()
            outputs = self.llm.pipe(
                prompt,
                max_new_tokens=300,
                do_sample=False,
                pad_token_id=self.llm.pipe.tokenizer.eos_token_id
            )
            return outputs[0]["generated_text"].split("<|assistant|>")[-1].strip()
        except Exception as e:
            return f"Executive Summary: Analyzed {len(req.records)} records. Top disease: {diseases[0].condition if diseases else 'N/A'}. (Narrative generation failed: {str(e)})"

    def _empty_report(self, period: str) -> AnalyticsReport:
        return AnalyticsReport(
            report_period=period,
            total_patients_analyzed=0,
            top_diseases=[],
            high_risk_demographics=[],
            outcome_summary={},
            executive_briefing="No data available for analysis."
        )
