import React, { useState } from "react";
import { Modal, Button } from "antd";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import { paths } from "../lib/path";
import { useGlobalMessage } from "./MessageProvider/MessageProvider";

export default function OTPModal({ isOpen, onClose, email, nextAction }) {
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const message = useGlobalMessage();

    const handleVerify = async () => {
        if (otp.length !== 6) {
            // setMessage("Please enter a valid 6-digit OTP.");
            return alert("Please enter a valid 6-digit OTP.");
        }

        setLoading(true);
        // setMessage("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();
            if (res.ok) {
                // setMessage("✅ Verification successful!");
                setTimeout(() => {
                    onClose();
                    message.success("Email verified successfully. Please log in again.")
                    if (nextAction) nextAction();
                    else navigate(paths.LOGIN);

                    // window.location.reload(); // optional
                }, 1000);
            } if (data.message === "Invalid or expired OTP") {
                alert("Invalid or expired OTP. Please try again.");
            } else {
                alert(data.message || "Something went wrong. Try again.");
            }
        } catch (err) {
            message(err || 'Incorrect OTP')
            // setMessage("❌ Something went wrong. Try again.");
            alert("Incorrect OTP, please enter the correct otp")
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
            bodyStyle={{ padding: "24px" }}
        >
            {/* Title */}
            <h2 className="text-[20px] font-semibold leading-[1.3] mb-2">
                Verify Your Email
            </h2>
            <p className="text-[14px] text-gray-600 mb-6">
                Please enter the 6-digit OTP sent to your email address.
            </p>

            {/* OTP Input */}
            <div className="flex justify-center mb-6">
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span className="mx-2 text-gray-400">-</span>}
                    renderInput={(props) => (
                        <input
                            {...props}
                            className="w-30 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg
                 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none
                 transition duration-150 ease-in-out"
                        />
                    )}
                />

            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
                <Button onClick={() => { }}>Cancel</Button>
                <Button
                    type="primary"
                    loading={loading}
                    onClick={handleVerify}
                >
                    Verify
                </Button>
            </div>
        </Modal>
    );
}