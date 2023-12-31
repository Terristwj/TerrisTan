"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { IconSend, IconRefresh, IconLoading } from "./ReactIcons";

import FormButton from "./FormButton";

export default function FormContent() {
    // Button loading
    const { pending } = useFormStatus();

    const router = useRouter();
    return (
        <>
            {/* Input message START */}
            <input
                type="text"
                placeholder="Leave a message..."
                name="message"
                required
                disabled={pending}
                className={
                    (pending && "opacity-50 cursor-not-allowed select-none") +
                    " pl-4 pr-32 py-2 mt-1 block w-full rounded-sm bg-gray-100 border-gray-700 text-neutral-900" +
                    " placeholder:italic placeholder:black placeholder:dark:white" +
                    " focus:placeholder:text-teal-600 focus:placeholder:dark:text-teal-500" +
                    " dark:bg-neutral-800 dark:border-gray-100 dark:text-neutral-100" +
                    " focus:ring-teal-500 focus:border-teal-500" +
                    " hover:placeholder:text-teal-600 hover:placeholder:dark:text-teal-500" +
                    " hover:ring-teal-500 hover:border-teal-500"
                }
            ></input>
            {/* Input message END */}

            {/* Buttons START */}
            <div className="absolute right-2 mt-1 h-7 font-medium flex gap-2">
                {pending ? (
                    <>
                        {/* Loading Button START */}
                        <FormButton type="button" disabled={true}>
                            <IconLoading />
                        </FormButton>
                        {/* Loading Button END */}
                    </>
                ) : (
                    <>
                        {/* Send Button START */}
                        <FormButton type="submit">
                            <IconSend />
                        </FormButton>
                        {/* Send Button END */}

                        {/* Refresh Button START */}
                        <FormButton
                            type="button"
                            onClick={() => router.refresh()}
                        >
                            <IconRefresh />
                        </FormButton>
                        {/* Refresh Button END */}
                    </>
                )}
            </div>
            {/* Buttons END */}
        </>
    );
}