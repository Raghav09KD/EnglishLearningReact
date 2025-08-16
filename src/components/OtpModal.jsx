import React, { useState } from "react";
import { Modal, Button, message } from "antd";
import OTPInput from "react-otp-input";

export default function OTPModal({ isOpen, onClose, email }) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        if (otp.length !== 6) {
            // setMessage("Please enter a valid 6-digit OTP.");
            return;
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
                    window.location.reload(); // optional
                }, 1000);
            } else {
                // setMessage(`❌ ${data.message}`);
            }
        } catch (err) {
            // setMessage("❌ Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onCancel={() => { }}
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
                    renderSeparator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
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