/*
========================================
AIAKOS EventBus
Framework v2.0

共用事件總線
讓 Controller、Module、Engine 之間可以低耦合溝通
========================================
*/

class EventBus {

    constructor() {
        this.events = {};
    }

    on(eventName, callback) {

        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(callback);

    }

    off(eventName, callback) {

        if (!this.events[eventName]) return;

        this.events[eventName] =
            this.events[eventName].filter(
                fn => fn !== callback
            );

    }

    emit(eventName, payload = {}) {

        if (!this.events[eventName]) return;

        this.events[eventName].forEach(callback => {

            try {
                callback(payload);
            } catch (error) {
                console.error(
                    `[EventBus] ${eventName} error:`,
                    error
                );
            }

        });

    }

}

window.EventBus = EventBus;