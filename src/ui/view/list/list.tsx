/**
 * We can use real unit for itemHeight by using this kind of code:
 *
 * 	const css = window.getComputedStyle(div)
 *  const height = css.getPropertyValue("height")
 */
import * as React from "react"
import Debouncer from "../../../tools/async/debouncer"
import Background from "./background.png"
import "./list.css"

const SCROLL_DEBOUNCE_DELAY = 30

interface IListProps<T> {
    // Array of all the items to hold.
    items: T[]
    className?: string
    // Function which takes an item and return a component.
    render: (item: T) => React.ReactElement
    itemHeight: string
    // URL of an image used as a placeholder when items are not yet displayed.
    placeholder?: string
}

const DEBOUNCE_REFRESH = 100

export default function List<T>(props: IListProps<T>) {
    const { items, render, itemHeight } = props
    const placeholder = props.placeholder ?? Background
    const refDiv = React.useRef<null | HTMLDivElement>(null)
    const refItem = React.useRef<null | HTMLDivElement>(null)
    const [visibleItems, setVisibleItems] = React.useState(items)
    const [headerHeight, setHeaderHeight] = React.useState(0)
    const [footerHeight, setFooterHeight] = React.useState(0)
    const [itemHeightInPx, setItemHeightInPx] = React.useState(0)
    React.useEffect(() => {
        const divItem = refItem.current
        const div = refDiv.current
        if (!divItem || !div) return

        const rect = divItem.getBoundingClientRect()
        setItemHeightInPx(rect.height)
        refresh()
        div.addEventListener("scroll", refresh)
        const observer = new ResizeObserver(refresh)
        observer.observe(div)
        return () => {
            div.removeEventListener("scroll", refresh)
            observer.unobserve(div)
        }
    }, [itemHeightInPx, items])
    const refresh = React.useMemo(
        () =>
            Debouncer(() => {
                const div = refDiv.current
                const divItem = refItem.current
                if (!div || !divItem || items.length === 0) return

                const rect = divItem.getBoundingClientRect()
                setItemHeightInPx(rect.height)
                const percent = div.scrollTop / div.scrollHeight
                const index = Math.floor(items.length * percent)
                const count = Math.min(
                    items.length - index,
                    Math.ceil(
                        1 + div.getBoundingClientRect().height / itemHeightInPx
                    )
                )
                const visibleItems = items.slice(index, index + count)
                setVisibleItems(visibleItems)
                setHeaderHeight(index * itemHeightInPx)
                setFooterHeight((items.length - index - count) * itemHeightInPx)
            }, DEBOUNCE_REFRESH),
        [items, itemHeightInPx]
    )
    const backgroundStyle: React.CSSProperties = {
        backgroundImage: `url(${placeholder})`,
        backgroundRepeat: "repeat-y",
        backgroundSize: `100% ${itemHeightInPx}px`,
    }
    return (
        <div className={`ui-view-List ${props.className ?? ""}`} ref={refDiv}>
            <div
                className="invisible-item"
                ref={refItem}
                style={{ height: itemHeight }}
            ></div>
            <header
                style={{ ...backgroundStyle, height: `${headerHeight}px` }}
            ></header>
            <>
                {visibleItems.map((item, idx) => (
                    <div
                        className="item"
                        key={idx}
                        style={{ height: itemHeight }}
                    >
                        {render(item)}
                    </div>
                ))}
            </>
            <footer
                style={{ ...backgroundStyle, height: `${footerHeight}px` }}
            ></footer>
        </div>
    )
}
