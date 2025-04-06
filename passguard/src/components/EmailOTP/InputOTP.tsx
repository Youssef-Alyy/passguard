import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onOtpChange: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ length = 6, onOtpChange }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const [allDigitsEntered, setAllDigitsEntered] = useState(false);
  const otpInputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && otpInputRefs.current[index + 1]) {
        otpInputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      otpInputRefs.current[index - 1]
    ) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  useEffect(() => {
    const isAllDigitsEntered = otp.every((digit) => digit !== "");
    setAllDigitsEntered(isAllDigitsEntered);

    if (isAllDigitsEntered) {
      onOtpChange(otp.join(""));
    }
  }, [otp, onOtpChange]);

  return (
    <div className="flex justify-center py-4">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          className="w-12 h-12 text-2xl border border-grey-400 rounded-md text-center mx-1 shadow-md dark:border-darkborder-999 dark:bg-darkinset-999 dark:text-darktext-999"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => {
            if (el) otpInputRefs.current[index] = el;
          }}
        />
      ))}
    </div>
  );
};

export default OtpInput;
