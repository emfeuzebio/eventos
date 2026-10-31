// src/services/userAdminService.js
import apiAcl from '@/services/apiAcl';

const BASE = 'admin/users';
const AUDIT_BASE = 'admin/audit';

export default {
   // ===== CRUD de usuários =====
   list(params = {}) {
      return apiAcl.get(BASE, { params });
   },

   show(id) {
      return apiAcl.get(`${BASE}/${id}`);
   },

   create(payload) {
      return apiAcl.post(BASE, payload);
   },

   update(id, payload) {
      return apiAcl.put(`${BASE}/${id}`, payload);
   },

   destroy(id) {
      return apiAcl.delete(`${BASE}/${id}`);
   },

   // ===== Ações =====
   activate(id) {
      return apiAcl.post(`${BASE}/${id}/activate`);
   },

   suspend(id) {
      return apiAcl.post(`${BASE}/${id}/suspend`);
   },

   resendInvite(id) {
      return apiAcl.post(`${BASE}/${id}/resend-invite`);
   },

   forceReset(id) {
      return apiAcl.post(`${BASE}/${id}/force-reset`);
   },

   // ===== Perfis =====
   listProfiles(id) {
      return apiAcl.get(`${BASE}/${id}/profiles`);
   },

   grantProfile(id, profileId) {
      return apiAcl.post(`${BASE}/${id}/profiles/${profileId}`);
   },

   revokeProfile(id, profileId) {
      return apiAcl.delete(`${BASE}/${id}/profiles/${profileId}`);
   },

   // ===== Consultas =====
   authorizations(id) {
      return apiAcl.get(`${BASE}/${id}/authorizations`);
   },

   history(id, params = {}) {
      return apiAcl.get(`${BASE}/${id}/history`, { params });
   },

   // ===== Auditoria global =====
   audit(params = {}) {
      return apiAcl.get(AUDIT_BASE, { params });
   },
};