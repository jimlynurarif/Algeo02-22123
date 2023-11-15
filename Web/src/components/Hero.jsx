import React from "react";
import { Button } from "@material-tailwind/react";


const Hero = () => {
    return ( 
        <div>
            <section className="max-w[800px] 
                                mt-[-180px] 
                                w-full 
                                h-screen 
                                mx-auto 
                                text-center 
                                flex flex-col justify-center">
                <h1 className="font-bold md:text-7xl sm:text-5xl sm:p-1 sm:mt-[180px] text-4xl p-1.5 ">
                    <span className="
                        bg-gradient-to-tr 
                        from-[#548b46]
                        to-[#55aa6f]
                        text-transparent 
                        bg-clip-text
                        pr-3
                        ">
                        Uncover
                    </span>
                    patterns
                </h1>
                <h1 className="font-bold md:text-7xl sm:text-4xl sm:p-1  text-4xl p-1.5">
                    Search with 
                    <span className="
                        bg-gradient-to-tr 
                        from-[#548b46]
                        to-[#55aa6f]
                        text-transparent 
                        bg-clip-text
                        pl-3
                        ">
                        Matrix
                    </span>
                </h1>
                <h1 className="font-bold  md:text-7xl sm:text-4xl sm:p-1 text-3xl p-1.5">
                    Explore visual 
                    <span className="
                        bg-gradient-to-tr 
                        from-[#548b46]
                        to-[#55aa6f]
                        text-transparent 
                        bg-clip-text
                        pl-3
                        ">
                        connections
                    </span>
                    .
                </h1>
                <p className="py-6 md:w-[520px] mx-auto sm:w-[400px] font-medium md:text-base sm:text-sm text-xs w-[350px]">
                    Unleash the power of our cutting-edge image search algorithm. 
                    By analyzing textures and colors, our program identifies patterns across your dataset, 
                    opening new possibilities for image discovery. Experience image searching like never 
                    before with our advanced Matrix technology.
                </p>
                <div className="flex justify-center items-center gap-6 py-5">
                    <a href="#buttons-with-link">
                        <Button variant="outlined" color="green">Explore the Guide</Button>
                    </a>
                    <a href="#buttons-with-link">
                        <Button variant="gradient" color="green">
                            Start Image Processing
                        </Button>
                    </a>
                </div>
            </section>
        </div>
     );
}
 
export default Hero;