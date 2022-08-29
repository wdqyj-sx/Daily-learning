interface radio{
    switchRadio(trigger:boolean):void
}

interface Battery{
    checkBatteryStatus():void
}

interface radioWithBattery extends radio{
    checkBatteryStatus():void
}

class car implements radio{
    switchRadio(trigger: boolean): void {
        
    }
}

class cellPhone implements radioWithBattery{
    checkBatteryStatus(): void {
        
    }
    switchRadio(trigger: boolean): void {
        
    }
}