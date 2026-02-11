import { useState } from "react";
import ExamCodeForm from "./ExamCodeForm";
import ExamWaiting from "./ExamWaiting";
import AvailableQuizzes from "./AvailableQuizzes";

const ExamEntry = () => {
    const [examStatus, setExamStatus] = useState(null);
    const [examData, setExamData] = useState(null);

    return (
        <div className="max-w-4xl mx-auto p-6">
            {!examStatus && (
                <>
                    <div className="max-w-md mx-auto">
                        <ExamCodeForm
                            setExamStatus={setExamStatus}
                            setExamData={setExamData}
                        />
                    </div>
                    <AvailableQuizzes />
                </>
            )}

            {examStatus === "waiting" && <ExamWaiting exam={examData} />}
            {examStatus === "live" && <p>Redirecting to exam...</p>}
            {examStatus === "ended" && (
                <p className="text-red-600 font-semibold">
                    Exam ended or invalid code
                </p>
            )}
        </div>
    );
};

export default ExamEntry;
