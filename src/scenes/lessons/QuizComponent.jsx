import React, { useState } from "react";
import { Typography, Button, Radio, RadioGroup, FormControlLabel, FormControl, Chip, Box } from "@mui/material";

const QuizComponent = ({ questions }) => {
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [score, setScore] = useState(0);
   const [selectedOption, setSelectedOption] = useState(-1);

   const handleOptionChange = (event) => {
      setSelectedOption(event.target.value);
   };

   const handleNextQuestion = () => {
      const currentQuestion = questions[currentQuestionIndex];

      const selectedOptionData = currentQuestion.answer.find((ans) => ans.id === parseInt(selectedOption));

      if (selectedOptionData.is_right) {
         setScore(score + 1);
      }

      setSelectedOption(-1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
   };

   if (currentQuestionIndex >= questions.length) {
      return (
         <div>
            <Typography variant="h4">Quiz Completed!</Typography>
            <Typography variant="h6">
               Your Score: {score} / {questions.length}
            </Typography>
         </div>
      );
   }

   const currentQuestion = questions[currentQuestionIndex];

   return (
      <div>
         <Box style={{ display: "flex", marginBottom: "12px" }}>
            <Typography variant="h5">Question {currentQuestionIndex + 1}</Typography>
            {currentQuestion && currentQuestion.difficulty && (
               <React.Fragment>
                  {(() => {
                     switch (currentQuestion.difficulty) {
                        case 1:
                           return <Chip style={{ marginLeft: "20px" }} size="small" label="Başlangıç" color="success" />;
                        case 2:
                           return <Chip style={{ marginLeft: "20px" }} size="small" label="Orta" color="warning" />;
                        case 3:
                           return <Chip style={{ marginLeft: "20px" }} size="small" label="İleri" color="error" />;
                        default:
                           return null;
                     }
                  })()}
               </React.Fragment>
            )}
         </Box>
         <Typography variant="body1">{currentQuestion.question_text}</Typography>
         <FormControl component="fieldset" style={{ display: "flex" }}>
            <RadioGroup value={selectedOption} onChange={handleOptionChange}>
               {currentQuestion.answer.map((ans, index) => (
                  <FormControlLabel
                     key={index}
                     value={ans.id}
                     control={
                        <Radio
                           sx={{
                              color: "pink",
                              "&.Mui-checked": {
                                 color: "pink",
                              },
                           }}
                        />
                     }
                     label={ans.answer_text}
                  />
               ))}
            </RadioGroup>
         </FormControl>
         <Button variant="contained" color="primary" onClick={handleNextQuestion} disabled={!selectedOption}>
            Next
         </Button>
      </div>
   );
};

export default QuizComponent;
