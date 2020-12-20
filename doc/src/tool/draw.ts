type ICommand = (ctx: CanvasRenderingContext2D) => void

export default class Draw {
    private readonly commands: ICommand[] = []

    /**
     * Apply the drawing commands to the given Canvas.
     */
    apply(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d")
        if (!ctx) throw "Unable to create 2D context!"

        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)
        for (const cmd of this.commands) {
            cmd(ctx)
        }
    }
}