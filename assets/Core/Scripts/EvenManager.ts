import { _decorator, EventTarget } from 'cc';
import { EDITOR_NOT_IN_PREVIEW } from 'cc/env';

enum ExampleEventType
{
	STATE_CHANGED = 'state_changed'
}

interface ExampleEventMap 
{
    [ExampleEvenManager.EventType.STATE_CHANGED]: (amount : number) => void,
}

export class ExampleEvenManager
{
	public static readonly EventType = ExampleEventType;

	private _eventTarget : EventTarget = new EventTarget();

	private _state: number = 0;

	public on <K extends keyof ExampleEventMap> (eventType: K, callback: ExampleEventMap[K], target?: any): ExampleEventMap[K]
	{
        this._eventTarget.on(eventType, callback, target);
        return callback;
    }

	public once <K extends keyof ExampleEventMap> (eventType: K, callback: ExampleEventMap[K], target?: any): ExampleEventMap[K]
	{
        this._eventTarget.once(eventType, callback, target);
        return callback;
    }

	public off <K extends keyof ExampleEventMap> (eventType: K, callback?: ExampleEventMap[K], target?: any): void
	{
        if (EDITOR_NOT_IN_PREVIEW)
            return;
		
        this._eventTarget.off(eventType, callback, target);
    }

	public changeState(): void
	{
		this._state++;
		this._eventTarget.emit(ExampleEvenManager.EventType.STATE_CHANGED, this._state)
	}
}

export const example = new ExampleEvenManager();