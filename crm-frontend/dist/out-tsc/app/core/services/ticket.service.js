import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
let TicketService = class TicketService {
    constructor(http) {
        this.http = http;
        this.baseUrl = 'https://wade-nonauthentical-yawnfully.ngrok-free.dev';
    }
    getAllTickets() {
        return this.http.get(`${this.baseUrl}/tickets`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
    }
    getTicketById(id) {
        return this.http.get(`${this.baseUrl}/tickets/${id}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
    }
    createTicket(request) {
        return this.http.post(`${this.baseUrl}/test`, request, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
    }
    replyToTicket(id, request) {
        return this.http.post(`${this.baseUrl}/tickets/${id}/reply`, request, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
    }
    closeTicket(id) {
        return this.http.patch(`${this.baseUrl}/tickets/${id}/close`, {}, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
    }
};
TicketService = __decorate([
    Injectable({ providedIn: 'root' })
], TicketService);
export { TicketService };
//# sourceMappingURL=ticket.service.js.map