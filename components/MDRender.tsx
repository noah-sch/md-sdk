import React from "react";

import type { mdElements } from "../types/mdElements";

import mdElementParsing from "../utils/mdElementParsing";
import textBlockLineParsing from "../utils/textBlockLineParsing";
import inlineParsing from "../utils/inlineParsing";

import config from '../config.json';

type MDRenderProps = {
    markdown: string;
};


export default function MDRender({ markdown }: MDRenderProps) {
    const mdBlocks: mdElements = mdElementParsing(markdown);
    let elements: React.ReactNode[] = [];

    for (let block of mdBlocks) {
        if (block.type === 'code') {
            // Here : code block case -> 
            elements.push(
                <div className={`flex flex-col items-start justify-start ${config.code.background.color} ${config.code.rounded.size} max-w-full p-2 gap-2 border border-neutral-800 ${config.code.width}`}>
                    <div className="flex flex-row items-center justify-between w-full">
                        {config.code.language.enable && (
                            <div className={`${config.code.language.color} ${config.code.language.size}`}>
                                {block.language}
                            </div>
                        )}

                        {config.code.copyIcon.enable && (
                            <div className={`${config.code.language.color} ${config.code.language.size} cursor-pointer`}
                                onClick={() => {}}
                            >
                                yes
                            </div>
                        )}
                    </div>
                    {Object.entries(block)
                        .filter(([key]) => !isNaN(Number(key))) // garde uniquement les clés numériques
                        .map(([_, line], index) => (
                            <div key={index}
                                className=""
                            >
                                {line}
                            </div>
                    ))}
                </div>
            )


        } else if (block.type === 'text') {
            // Here : text block case -> 
            for (let line of Object.values(block)) {
                const firstLineParsing = textBlockLineParsing(line);
                const parsedLineElements = inlineParsing(firstLineParsing[1]);
                
            }
        }
    }
    return(
        <>
            {elements}
        </>
    )
}