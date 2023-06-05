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
   //derslerin tutulduğu state tanımlanır
   const [lessonsData, setLessonsData] = useState({});
   // derslerin bulunduğu sayfadan konferansların bulunduğu sayfaya geçiş için kullanılır
   // useNavigate ilgili sayfaya yönlendirme yapan bir react-router hookudur.
   const navigate = useNavigate();
   // video modalı için kullanılır , videoId state'i ile video id tutulur.
   // youtube iframe oluşturulması için gereklidir.
   const [videoId, setVideoId] = useState("");
   // modalın açık olup olmadığını tutar.
   const [open, setOpen] = useState(false);
   // konferans oluşturulduğunda kullanıcıya gösterilen snackbar için kullanılır.
   const [isAlertOpen, setAlertOpen] = useState(false);
   // ilgili dersin quiz verisini tutan statedir.
   const [questions, setQuestions] = useState([]);
   const [quizPoint, setQuizPoint] = useState(0);
   const [isQuizBtnVisible, setIsQuizBtnVisible] = useState(false);
   // ilgili dersin video linkinden video id'sini alır ve modalı açar.
   const handleOpen = (e) => {
      setVideoId(e.target.value.split("v=")[1]);
      setOpen(true);
      setIsQuizBtnVisible(true);
   };
   // modalı kapatan fonksiyondur.
   const handleClose = () => setOpen(false);
   // tüm ders verilerini çeken fonksiyondur.
   // fetchData servisler altında tanımlanmıştır ve ilgili endpointten verileri çeker.
   const setData = () => {
      fetchData().then((res) => {
         setLessonsData(res);
      });
   };
   // ilgili derste kullanıcının yaptığı tıklama türüne göre ilgili işlemleri opare eder.
   const handleClickLesson = (lessonId, lessonName, type) => {
      // dersi öğretmek isteyen kullanıcı için konferans oluşturulması işlemini servise bildiren kod parçasıdır.
      if (type === "teach")
         createConference({
            related_lesson: lessonId,
            conference_topic: lessonName,
         }).then((res) => {
            // konferans oluşturulduktan sonra kullanıcıya bildirim gösterilmesi için kullanılır.
            if (res.status == "success") setAlertOpen(true);
         });
      if (type == "listen") {
         // ilgili ders id si ile konferanslar componentine yönlendirme yapar. ve lessonId parametresi ekler
         navigate("/calendar/" + lessonId);
      }
   };
   // ilgili dersin quiz verisini çeken fonksiyondur.
   const handleFetchQuiz = (lessonId) => {
      fetchQuiz(5).then((res) => {
         setQuestions(res);
      });
   };
   const handlerQuizPoint = (point) => {
      setQuizPoint(point);
   };
   // sayfa ilk render olduğunda ders verilerini çeker.
   useEffect(() => {
      setData();
   }, []);
   return (
      <Box m="20px">
         <Header title="Dersler" subtitle="Ders listesi aşağıda listelenmiştir." />
         {/*ders kategorisine göre kategoriye ait dersler gerekli if kontrolleri ile kullanıcıya düzgün şekilde listelenir. */}
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
                                          {/* dersin zorluk derecesini göstermek için kullanılan kod parçasıdır difficulty verisi derslerden alınmaktadır. */}
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
                                             {/* dersin içeriğini ekranda render eden kod parçasıdır. 
                                             content içerisinde bulunan related_lesson ile ilgili dersin lesson id si eşleşiyorsa ilgili içerikler ekranda gösterilir.
                                             */}
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
                                                            {isQuizBtnVisible && (
                                                               <Button size="small" color="success" variant="contained" onClick={handleFetchQuiz}>
                                                                  Go to quiz
                                                               </Button>
                                                            )}
                                                            {/* öğreten mi öğretici mi olacağı burada tıkladığı buton ile karar verilir ve konferans işlemleri gerçekleşir */}
                                                            {quizPoint >= 80 ? (
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
                                                            ) : (
                                                               quizPoint > 0 &&
                                                               quizPoint <= 79 && (
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
                                                               )
                                                            )}
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
         {/* ilgili dersin video linkinden video id'sini alır ve modalı açar. Iframe ile youtube linkini ekrana yansıtır. */}
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
         {/* konferans oluşturulduktan sonra kullanıcıya bildirim gösterilmesi için kullanılır. */}
         <Snackbar open={isAlertOpen} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
               Ders anlatım video konferans linki oluşturuldu.
            </Alert>
         </Snackbar>
         {/* quiz verisi varsa quiz componenti render edilir. ve soru verileri quizcomponent isimli componente aktarılır. */}
         {questions.length > 0 && <QuizComponent questions={questions} quizPoint={quizPoint} setQuizPoint={handlerQuizPoint} />}
      </Box>
   );
};

export default Lessons;
