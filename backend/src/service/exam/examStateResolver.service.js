const examStateResolver = (quiz , currentTime = Date.now()) => {

    if(quiz.quizType !== 'exam' || !quiz.examConfig )   return 'normal';
    const { startTime, endTime } = quiz.examConfig;
    

    const now = new Date(currentTime).getTime();
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    // 5-second buffer for clock sync tolerance when redirecting from waiting room
    if (now < start - 5000) {
        return 'upcoming';
    } else if (now >= start - 5000 && now <= end) {
        return 'live';
    } else {
        return 'completed';
    }   
};
module.exports = { examStateResolver };