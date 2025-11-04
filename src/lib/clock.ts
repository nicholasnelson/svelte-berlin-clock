export interface BerlinClockOutputState {
    seconds: 0 | 1
    hours: {
        upper: boolean[],
        lower: boolean[],
    },
    minutes: {
        upper: boolean[],
        lower: boolean[],
    }
}

export class BerlinClock {
    private time: Date;

    constructor(time: Date = new Date()) {
        this.time = time;
    }

    setTime(time: Date): void {
        this.time = time;
    }

    getSeconds(): 1 | 0 {
        return this.time.getSeconds() % 2 === 1 ? 1 : 0;
    }

    getState(time: Date = this.time): BerlinClockOutputState {
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();

        return {
            seconds: seconds % 2 === 1 ? 1 : 0,
            hours: {
                upper: BerlinClock.fillRow(4, Math.floor(hours / 5)),
                lower: BerlinClock.fillRow(4, hours % 5),
            },
            minutes: {
                upper: BerlinClock.fillRow(11, Math.floor(minutes / 5)),
                lower: BerlinClock.fillRow(4, minutes % 5),
            }
        };
    }

    private static fillRow(length: number, litCount: number): boolean[] {
        const row = new Array<boolean>(length);
        for (let i = 0; i < length; i += 1) {
            row[i] = i < litCount;
        }
        return row;
    }
}
