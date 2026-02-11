const examStateResolver = (quiz , currentTime = Date.now()) => {

    if(quiz.quizType !== 'exam' || !quiz.examConfig )   return 'normal';
    const { startTime, endTime } = quiz.examConfig;
    

    const now = new Date(currentTime);
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) {
        return 'upcoming';
    } else if (now >= start && now <= end) {
        return 'live';
    } else {
        return 'completed';
    }   
};
module.exports = { examStateResolver };