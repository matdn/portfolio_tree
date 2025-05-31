import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactViewBase, { TransitionProps } from "../../../core/_engine/reacts/views/bases/ReactViewBase";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import Button from "./components/Button";
import { ViewsManager, ViewsProxy } from "pancake";
import { ViewId } from "../../../constants/views/ViewId";

const EntryReactView: React.FC<TransitionProps> = (props) => {
    const [isExiting, setIsExiting] = useState(false);

    const showMuseumTheater = () => {
        setIsExiting(true);
        setTimeout(() => {
            ViewsManager.HideById(ViewId.ENTRY_REACT);
        }, 1600);
        ViewsManager.ShowById(ViewId.MAIN_REACT);
        const mainView = ViewsProxy.GetView(ViewId.THREE_MAIN) as any;
        mainView.setLockCameraOnScroll(false);
    };

    return (
        <ReactViewBase {...props} className="w-screen fixed min-h-[100dvh] min-w-[100dvw] top-0 left-0 inset-0 text-white overflow-hidden">
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: isExiting ? 0 : 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                style={{
                    background: "linear-gradient(to bottom, black, rgba(0,0,0,0.8), black)"
                }}
            />

            <Header />

            <div className="flex items-center text-center py-8 flex-col justify-center h-full relative ">
                <AnimatePresence>
                    {!isExiting && (
                        <motion.h1
                            initial={{ opacity: 0, filter: "blur(10px)" }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                            className="text-[2rem] leading-[0.5] font-mabry uppercase font-italic md:text-[6rem] tracking-wide"
                        >
                            Portfolio <br />
                        </motion.h1>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {!isExiting && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 80 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="overflow-hidden mt-5 rounded-full"
                        >
                            <Button title="Explore" className="z-40 py-12" onClick={showMuseumTheater} iconPosition="right" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <Footer />
        </ReactViewBase>
    );
};

export default EntryReactView;