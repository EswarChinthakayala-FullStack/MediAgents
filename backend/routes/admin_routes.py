from flask import Blueprint, jsonify, request
from services.ai_service import ai_service

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/analytics/population', methods=['GET'])
def get_population_analytics():
    """Agent 09: Data Architect"""
    return jsonify(ai_service.get_population_analytics()), 200

@admin_bp.route('/audit', methods=['GET'])
def get_audit():
    """Agent 11: Audit Sentinel"""
    start = request.args.get('from')
    end = request.args.get('to')
    return jsonify(ai_service.get_audit_logs(start, end)), 200

@admin_bp.route('/agents', methods=['GET'])
@admin_bp.route('/health', methods=['GET'])
def get_agent_health():
    """Orchestrator: Fleet Health"""
    return jsonify(ai_service.get_agent_health()), 200

@admin_bp.route('/system-health', methods=['GET'])
def get_system_health():
    # Legacy health check logic or keep for backward compatibility
    return get_agent_health()
