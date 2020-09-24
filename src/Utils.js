

export function fireWaveChange() {
    var event;
    if(document.createEvent){
        event = document.createEvent("HTMLEvents");
        event.initEvent("wavechanged", true, true);
        event.eventName = "wavechanged";
        window.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventName = "wavechanged";
        event.eventType = "wavechanged";
        window.fireEvent("on" + event.eventType, event);
    }
}