import { Box, Modal, useTheme, Chip, Button, Snackbar, Alert } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { fetchData, createConference } from "../../services/lesson";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizComponent from "./QuizComponent.jsx";
import React from "react";
import { fetchQuiz } from "../../services/quiz";
const style = {
   position: "absolute",
   top: "50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width: 500,
   height: 500,
   bgcolor: "background.paper",
   boxShadow: 24,
   p: 4,
};

const Lessons = () => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const [lessonsData, setLessonsData] = useState({});
   const navigate = useNavigate();
   const [videoId, setVideoId] = useState("");
   const [open, setOpen] = useState(false);
   const [isAlertOpen, setAlertOpen] = useState(false);
   const [questions, setQuestions] = useState([]);
   const handleOpen = (e) => {
      setVideoId(e.target.value.split("v=")[1]);
      setOpen(true);
   };
   const handleClose = () => setOpen(false);
   const setData = () => {
      fetchData().then((res) => {
         setLessonsData(res);
      });
   };
   const handleClickLesson = (lessonId, lessonName, type) => {
      if (type === "teach")
         createConference({
            related_lesson: lessonId,
            conference_topic: lessonName,
         }).then((res) => {
            if (res.status == "success") setAlertOpen(true);
         });
      if (type == "listen") {
         navigate("/calendar/" + lessonId);
      }
   };
   const handleFetchQuiz = (lessonId) => {
      fetchQuiz(5).then((res) => {
         setQuestions(res);
      });
   };
   useEffect(() => {
      setData();
   }, []);
   return (
      <Box m="20px">
         <Header title="Dersler" subtitle="Ders listesi aşağıda listelenmiştir." />
         {lessonsData.categories &&
            lessonsData.categories.map((category) => (
               <Accordion defaultExpanded key={category.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <Typography color={colors.greenAccent[500]} variant="h2">
                        {category.category_name}
                     </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                     <Box>
                        {lessonsData.lessons &&
                           lessonsData.lessons.map(
                              (lesson, index) =>
                                 lesson.category === category.id &&
                                 lesson.is_active && (
                                    <Accordion key={"lsx" + lesson.id}>
                                       <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                          <Typography variant="h3">
                                             {index + 1}- {lesson.lesson_title}
                                          </Typography>
                                          {lesson && lesson.difficulty && (
                                             <React.Fragment>
                                                {(() => {
                                                   switch (lesson.difficulty) {
                                                      case 1:
                                                         return (
                                                            <Chip style={{ marginLeft: "20px" }} size="small" label="Başlangıç" color="success" />
                                                         );
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
                                       </AccordionSummary>
                                       <AccordionDetails>
                                          <Box>
                                             {lessonsData.contents &&
                                                lessonsData.contents.map(
                                                   (content, index) =>
                                                      content.related_lesson === lesson.id && (
                                                         <Box key={"ctx" + content.id}>
                                                            <Typography variant="h4">{content.content_header}</Typography>

                                                            <Typography>{content.content_text}</Typography>
                                                            <br />
                                                            <Button variant="contained" value={content.video_url} size="small" onClick={handleOpen}>
                                                               Lesson Video
                                                            </Button>
                                                            <Button size="small" color="success" variant="contained" onClick={handleFetchQuiz}>
                                                               Go to quiz
                                                            </Button>
                                                            <Button
                                                               onClick={() => {
                                                                  handleClickLesson(content.related_lesson, lesson.lesson_title, "teach");
                                                               }}
                                                               style={{ marginLeft: "12px" }}
                                                               type="button"
                                                               color="info"
                                                               variant="contained"
                                                               size="small">
                                                               Teach this lesson
                                                            </Button>
                                                            <Button
                                                               onClick={() => {
                                                                  handleClickLesson(content.related_lesson, lesson.lesson_title, "listen");
                                                               }}
                                                               style={{ marginLeft: "12px" }}
                                                               type="button"
                                                               color="error"
                                                               variant="contained"
                                                               size="small">
                                                               Listen from another student
                                                            </Button>
                                                         </Box>
                                                      )
                                                )}
                                          </Box>
                                       </AccordionDetails>
                                    </Accordion>
                                 )
                           )}
                     </Box>
                  </AccordionDetails>
               </Accordion>
            ))}
         <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box>
               <Box style={style} marginTop={8}>
                  <iframe
                     width="560"
                     height="315"
                     src={`https://www.youtube.com/embed/${videoId}`}
                     title="YouTube video player"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen></iframe>
               </Box>
            </Box>
         </Modal>
         <Snackbar open={isAlertOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
               Ders anlatım video konferans linki oluşturuldu.
            </Alert>
         </Snackbar>
         {questions.length > 0 && <QuizComponent questions={questions} />}
      </Box>
   );
};

export default Lessons;
