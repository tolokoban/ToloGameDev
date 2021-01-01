import React, { Suspense } from 'react'

import './app.css'


type IAsyncRender = Promise<{ render(): JSX.Element }>

interface IArticle {
    title: string,
    keywords: string[],
    content: React.LazyExoticComponent<typeof React.Component>
}

const SECTIONS: {
    [key: string]: {
        title: string,
        articles: {
            [key: string]: IArticle
        }
    }
} = {
    gallery: {
        title: "Gallery",
        articles: {
            dripping: {
                title: "Dripping",
                keywords: [],
                content: React.lazy(() => import("../gallery/dripping"))
            }
        }
    },
    lesson: {
        title: "Lessons",
        articles: {
            fundamentals: {
                title: "WebGL Fundamentals",
                keywords: [
                    "attachShader",
                    "bindBuffer",
                    "clear",
                    "clearColor",
                    "compileShader",
                    "createBuffer",
                    "createProgram",
                    "createShader",
                    "drawArrays",
                    "enableVertexAttribArray",
                    "linkProgram",
                    "shaderSource",
                    "useProgram",
                    "vertexAttribPointer"
                ],
                content: React.lazy(() => import("../article/lesson/fundamentals"))
            },
            uniforms: {
                title: "Uniforms",
                keywords: [
                    "attachShader",
                    "compileShader",
                    "createProgram",
                    "createShader",
                    "linkProgram",
                    "shaderSource",
                    "useProgram"
                ],
                content: React.lazy(() => import("../article/lesson/uniforms"))
            },
            varyings: {
                title: "Varyings",
                keywords: [
                    "varying"
                ],
                content: React.lazy(() => import("../article/lesson/varyings"))
            },
            troubleshooting: {
                title: "Troubleshooting",
                keywords: [],
                content: React.lazy(() => import("../article/lesson/troubleshooting"))
            }
        }
    },
    solution: {
        title: "Exercices Answers",
        articles: {
            fundamentals: {
                title: "Solution: drawing three triangles",
                keywords: [],
                content: React.lazy(() => import("../article/solution/fundamentals"))
            }
        }
    },
    tool: {
        title: "Tools",
        articles: {
            attributes: {
                title: "Attributes Structure",
                keywords: ["attribute"],
                content: React.lazy(() => import("../tool/attributes"))
            }
        }
    }
}


export interface IAppProps {
    className?: string
}

interface IAppState {
    hash: string
    article: IArticle | null
}

export default abstract class App extends React.Component<IAppProps, IAppState> {
    state: IAppState = {
        hash: "",
        article: null
    }

    componentDidMount() {
        window.addEventListener("hashchange", this.handleHashChange, false)
        this.handleHashChange()
    }

    componentWillUnmount() {
        window.removeEventListener("hashchange", this.handleHashChange, false)
    }

    private readonly handleHashChange = () => {
        this.setState({ article: null })
        const hash = window.location.hash.substr(1)
        const [sectionId, articleId] = hash.split("/")
        const section = SECTIONS[sectionId]
        if (!section) return

        const article = section.articles[articleId]
        if (!article) return

        this.setState({ article, hash })
    }

    render() {
        const { article } = this.state

        if (article) {
            return <Suspense
                fallback={<div>Loading <b>{article.title}</b>...</div>}
            >{
                    React.createElement(article.content)
                }</Suspense>
        }

        return <div className="App">
            <div className="thm-bg1 thm-ele-dialog">{
                Object.keys(SECTIONS).map(renderSection)
            }</div>
        </div>
    }
}


function renderSection(sectionId: string) {
    const section = SECTIONS[sectionId]
    return <section key={sectionId}>
        <h1>{section.title}</h1>
        <ul>{
            Object.keys(section.articles).map(
                articleId => {
                    const article = section.articles[articleId]
                    return <li key={articleId}>
                        <a href={`#${sectionId}/${articleId}`}>{
                            article.title
                        }</a>
                    </li>
                }
            )
        }</ul>
    </section>
}