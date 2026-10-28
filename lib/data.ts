// ALL content below is self-written practice material in TOEIC format.
// It is NOT copied from any real ETS test, audio, or transcript.
export type Question = {
  id: string;
  question: string;
  options: string[];
  answer: number; // index into options
  explanation: string;
};

export type Part1Item = {
  id: string;
  scene: string; // textual stand-in for the photo, read in Vietnamese-friendly English
  sceneVi: string;
  statements: string[]; // 4 spoken statements, one is correct
  answer: number;
  explanation: string;
};

export type Part2Item = {
  id: string;
  question: string;
  options: string[]; // 3 responses
  answer: number;
  explanation: string;
};

export type Passage = {
  id: string;
  title: string;
  script: string;
  questions: Question[];
};

export const part1: Part1Item[] = [
  {
    id: "p1-01",
    scene: "A woman is watering plants on a small office balcony.",
    sceneVi: "Một phụ nữ đang tưới cây trên ban công văn phòng nhỏ.",
    statements: [
      "The woman is watering the plants.",
      "The woman is typing on a computer.",
      "The woman is opening a window.",
      "The woman is carrying a box.",
    ],
    answer: 0,
    explanation: "Chỉ có câu A khớp hành động trong tranh: đang tưới cây. Các câu còn lại nói hành động khác, không có trong tranh.",
  },
  {
    id: "p1-02",
    scene: "Two men are shaking hands in a meeting room.",
    sceneVi: "Hai người đàn ông đang bắt tay trong phòng họp.",
    statements: [
      "The men are eating lunch.",
      "The men are shaking hands.",
      "The men are leaving the room.",
      "The men are writing on a board.",
    ],
    answer: 1,
    explanation: "Câu B đúng: hai người đang bắt tay. Đừng chọn câu có từ quen thuộc nhưng hành động sai.",
  },
  {
    id: "p1-03",
    scene: "A delivery worker is placing boxes on a shelf in a warehouse.",
    sceneVi: "Một nhân viên giao hàng đang xếp hộp lên kệ trong kho.",
    statements: [
      "The worker is driving a truck.",
      "The boxes are on the floor.",
      "The worker is placing boxes on a shelf.",
      "The worker is closing the door.",
    ],
    answer: 2,
    explanation: "Chú ý vị trí: hộp đang được xếp LÊN KỆ, không phải dưới sàn hay trên xe.",
  },
  {
    id: "p1-04",
    scene: "A man is waiting at a bus stop with a bag.",
    sceneVi: "Một người đàn ông đang đợi ở trạm xe buýt, mang theo một túi.",
    statements: [
      "The man is getting on a bus.",
      "The man is waiting at a bus stop.",
      "The man is buying a ticket.",
      "The man is crossing the street.",
    ],
    answer: 1,
    explanation: "Người đàn ông mới chỉ đang ĐỢI, chưa lên xe. Câu A nói hành động chưa xảy ra là bẫy thường gặp.",
  },
  {
    id: "p1-05",
    scene: "Several laptops are arranged on a long table in a training room.",
    sceneVi: "Nhiều laptop được xếp trên bàn dài trong phòng đào tạo.",
    statements: [
      "The laptops are on the table.",
      "The laptops are in a bag.",
      "A woman is using a laptop.",
      "The table is next to a window.",
    ],
    answer: 0,
    explanation: "Tranh không có người dùng laptop, chỉ có laptop TRÊN BÀN. Câu C thêm người không có trong tranh.",
  },
  {
    id: "p1-06",
    scene: "A receptionist is answering a phone at a hotel front desk.",
    sceneVi: "Một lễ tân đang nghe điện thoại ở quầy lễ tân khách sạn.",
    statements: [
      "The receptionist is checking in a guest.",
      "The receptionist is answering the phone.",
      "The receptionist is cleaning the desk.",
      "The receptionist is opening a suitcase.",
    ],
    answer: 1,
    explanation: "Hành động chính là nghe điện thoại. Các câu khác đều là việc lễ tân hay làm nhưng không phải việc trong tranh.",
  },
  {
    id: "p1-07",
    scene: "Workers are repairing a road, and traffic cones are placed around them.",
    sceneVi: "Công nhân đang sửa đường, xung quanh có cọc tiêu giao thông.",
    statements: [
      "The workers are painting a building.",
      "The cones are on the road.",
      "The workers are repairing the road.",
      "A car is parked in a garage.",
    ],
    answer: 2,
    explanation: "Câu C đúng cả người và việc. Câu B đúng một phần (cọc tiêu có trên đường) nhưng không phải đáp án mô tả đầy đủ nhất về hành động chính.",
  },
  {
    id: "p1-08",
    scene: "A woman is reading a book near a window in a quiet library.",
    sceneVi: "Một phụ nữ đang đọc sách gần cửa sổ trong thư viện yên tĩnh.",
    statements: [
      "The woman is writing a letter.",
      "The woman is reading a book near a window.",
      "The woman is talking on the phone.",
      "The woman is leaving the library.",
    ],
    answer: 1,
    explanation: "Câu B khớp cả hành động (đọc sách) và vị trí (gần cửa sổ).",
  },
];

export const part2: Part2Item[] = [
  { id: "p2-01", question: "When does the meeting start?", options: ["At nine o'clock.", "In the meeting room.", "Yes, it is on Monday."], answer: 0, explanation: "Hỏi WHEN thì trả lời thời gian. Phòng họp là WHERE, không phải đáp án." },
  { id: "p2-02", question: "Where is the new office?", options: ["It opens at eight.", "On the third floor.", "Two new managers."] , answer: 1, explanation: "Hỏi WHERE thì trả lời địa điểm: tầng 3." },
  { id: "p2-03", question: "Who will pick up the client at the airport?", options: ["Mr. Lee will.", "At the airport.", "Next Tuesday."] , answer: 0, explanation: "Hỏi WHO thì trả lời người: anh Lee." },
  { id: "p2-04", question: "Do you have the report ready?", options: ["Yes, I sent it this morning.", "In the report.", "The report is long."] , answer: 0, explanation: "Câu hỏi Yes/No thì đáp án đúng thường bắt đầu bằng Yes/No và nói thêm thông tin." },
  { id: "p2-05", question: "How much is the ticket?", options: ["It is twenty dollars.", "It is on Friday.", "The train is fast."] , answer: 0, explanation: "Hỏi HOW MUCH (giá tiền) thì trả lời số tiền." },
  { id: "p2-06", question: "Why is the store closed today?", options: ["Because of the holiday.", "At the store.", "The store is big."] , answer: 0, explanation: "Hỏi WHY thì trả lời lý do, thường bắt đầu bằng Because." },
  { id: "p2-07", question: "Can you send me the file today?", options: ["Sure, I will send it now.", "The file is important.", "In my office."] , answer: 0, explanation: "Can you... là lời nhờ, đáp án đồng ý: Sure." },
  { id: "p2-08", question: "What time does the shop close?", options: ["At ten in the evening.", "Near the station.", "Yes, it closes."] , answer: 0, explanation: "Hỏi WHAT TIME thì trả lời giờ giấc, không trả lời Yes." },
  { id: "p2-09", question: "Have you booked the hotel yet?", options: ["No, not yet.", "The hotel is nice.", "In July."] , answer: 0, explanation: "Have you... yet? thì đáp án là Yes/No + yet/already." },
  { id: "p2-10", question: "Where can I park my car?", options: ["Behind the building.", "At five o'clock.", "My car is red."] , answer: 0, explanation: "Hỏi WHERE thì trả lời vị trí: phía sau tòa nhà." },
  { id: "p2-11", question: "When will the package arrive?", options: ["Tomorrow morning.", "From the warehouse.", "It is heavy."] , answer: 0, explanation: "Hỏi WHEN thì trả lời thời gian: sáng mai." },
  { id: "p2-12", question: "Who is in charge of the project?", options: ["Ms. Park is.", "The project is new.", "In March."] , answer: 0, explanation: "Hỏi WHO thì trả lời người phụ trách: cô Park." },
  { id: "p2-13", question: "Is the meeting room free now?", options: ["Yes, it is empty.", "The room is large.", "At noon."] , answer: 0, explanation: "Câu hỏi Is...? thì đáp án Yes/No. Phòng trống nghĩa là đang free." },
  { id: "p2-14", question: "How do I get to the station?", options: ["Go straight, then turn left.", "The station is busy.", "By train."] , answer: 0, explanation: "Hỏi HOW (đi như thế nào) thì trả lời chỉ đường, không chỉ trả lời phương tiện." },
  { id: "p2-15", question: "What does this machine do?", options: ["It prints labels.", "It is new.", "In the office."] , answer: 0, explanation: "Hỏi WHAT (chức năng) thì trả lời công dụng: in nhãn." },
  { id: "p2-16", question: "Would you like coffee or tea?", options: ["Coffee, please.", "Yes, I like coffee.", "At lunch."] , answer: 0, explanation: "Câu hỏi lựa chọn or thì đáp án chọn 1 trong 2, không trả lời Yes chung chung." },
  { id: "p2-17", question: "Did you call the supplier?", options: ["Yes, yesterday afternoon.", "The supplier is in town.", "A new supplier."] , answer: 0, explanation: "Did you...? thì đáp án Yes/No + thời gian." },
  { id: "p2-18", question: "How many people are coming to the training?", options: ["About twenty.", "In the training room.", "Next week."] , answer: 0, explanation: "Hỏi HOW MANY thì trả lời số lượng." },
  { id: "p2-19", question: "Where did you put the keys?", options: ["On my desk.", "My keys are new.", "This morning."] , answer: 0, explanation: "Hỏi WHERE thì trả lời vị trí, dù thời gian hay tính chất cũng không phải đáp án." },
  { id: "p2-20", question: "Why did you change the date?", options: ["Because the room was booked.", "On Friday.", "The date is new."] , answer: 0, explanation: "Hỏi WHY thì trả lời lý do bằng Because." },
  { id: "p2-21", question: "Can I use your phone?", options: ["Of course, here you are.", "My phone is new.", "In the meeting."] , answer: 0, explanation: "Can I...? là xin phép, đáp án đồng ý: Of course." },
  { id: "p2-22", question: "What is the deadline for the report?", options: ["Friday at noon.", "The report is ready.", "Ms. Kim wrote it."] , answer: 0, explanation: "Hỏi deadline thì trả lời thời hạn: thứ Sáu lúc trưa." },
  { id: "p2-23", question: "Aren't you going to the conference?", options: ["No, I have to stay here.", "The conference is large.", "In June."] , answer: 0, explanation: "Câu hỏi phủ định Aren't you...? vẫn trả lời theo sự thật: No (không đi) vì phải ở lại." },
  { id: "p2-24", question: "How long does the bus take?", options: ["About thirty minutes.", "The bus is full.", "At the bus stop."] , answer: 0, explanation: "Hỏi HOW LONG (bao lâu) thì trả lời khoảng thời gian." },
];

export const part3: Passage[] = [
  {
    id: "p3-01",
    title: "Đổi lịch họp với khách hàng",
    script:
      "Woman: Hi, Tom. Can we move our meeting with the client from Tuesday to Thursday? Man: Thursday should be fine. What time were you thinking? Woman: How about ten in the morning? The client wants to finish before lunch. Man: Ten works for me. I will send a new invitation today.",
    questions: [
      { id: "p3-01-q1", question: "What are the speakers mainly discussing?", options: ["A new client", "A change to a meeting time", "A lunch menu", "A travel plan"], answer: 1, explanation: "Họ bàn việc dời lịch họp từ thứ Ba sang thứ Năm, không phải khách hàng mới hay ăn trưa." },
      { id: "p3-01-q2", question: "When will the meeting take place?", options: ["Tuesday morning", "Thursday at ten", "Thursday before nine", "Friday at lunch"], answer: 1, explanation: "Người phụ nữ đề xuất 10 giờ sáng thứ Năm và người đàn ông đồng ý." },
      { id: "p3-01-q3", question: "What will the man do?", options: ["Call the client", "Cancel the meeting", "Send a new invitation", "Book a lunch table"], answer: 2, explanation: "Anh ấy nói: I will send a new invitation today." },
    ],
  },
  {
    id: "p3-02",
    title: "Đặt phòng họp và máy chiếu",
    script:
      "Man: Excuse me, is the large meeting room free on Friday afternoon? Woman: Let me check. Yes, it is free from two to four. Man: Great. Can we also use the projector? Woman: Of course. I will ask the technician to set it up before three.",
    questions: [
      { id: "p3-02-q1", question: "What does the man want to use?", options: ["A small office", "The large meeting room", "A new computer", "The parking area"], answer: 1, explanation: "Anh ấy hỏi phòng họp LỚN, không phải văn phòng nhỏ." },
      { id: "p3-02-q2", question: "When is the room free?", options: ["Friday morning", "Friday from two to four", "Saturday afternoon", "Monday from two to four"], answer: 1, explanation: "Phòng trống từ 2 đến 4 giờ chiều thứ Sáu." },
      { id: "p3-02-q3", question: "What will the woman do?", options: ["Cancel the booking", "Ask the technician to set up the projector", "Buy a new projector", "Move the meeting to Monday"], answer: 1, explanation: "Cô ấy sẽ nhờ kỹ thuật viên chuẩn bị máy chiếu trước 3 giờ." },
    ],
  },
  {
    id: "p3-03",
    title: "Khách hỏi về giờ mở cửa cửa hàng",
    script:
      "Woman: Good morning. Do you sell phone chargers here? Man: Yes, they are near the entrance, on the left. Woman: Thank you. What time do you close today? Man: We close at nine this evening, but the sale ends at eight.",
    questions: [
      { id: "p3-03-q1", question: "Where are the phone chargers?", options: ["Near the entrance, on the left", "At the back of the store", "On the second floor", "Behind the counter"], answer: 0, explanation: "Nhân viên nói rõ: gần lối vào, phía bên trái." },
      { id: "p3-03-q2", question: "What time does the store close?", options: ["At eight", "At nine this evening", "At ten", "At noon"], answer: 1, explanation: "Cửa hàng đóng lúc 9 giờ tối; 8 giờ chỉ là lúc hết đợt giảm giá — đây là bẫy." },
      { id: "p3-03-q3", question: "What is the woman most likely doing?", options: ["Returning a phone", "Shopping in a store", "Working at a store", "Waiting for a bus"], answer: 1, explanation: "Cô ấy hỏi mua đồ và giờ đóng cửa, tức là đang mua sắm." },
    ],
  },
  {
    id: "p3-04",
    title: "Đồng nghiệp bàn về chuyến công tác",
    script:
      "Man: Are you ready for the business trip to Hanoi? Woman: Almost. I still need to book a hotel near the office. Man: The Green Hotel is close and not too expensive. Woman: Thanks. I will book it tonight and send you the details tomorrow.",
    questions: [
      { id: "p3-04-q1", question: "What does the woman still need to do?", options: ["Book a flight", "Book a hotel", "Buy a ticket", "Call the office"], answer: 1, explanation: "Cô ấy nói vẫn cần đặt khách sạn gần văn phòng." },
      { id: "p3-04-q2", question: "Which hotel does the man suggest?", options: ["The Blue Hotel", "The Green Hotel", "The River Hotel", "The City Hotel"], answer: 1, explanation: "Anh ấy gợi ý Green Hotel, gần và không quá đắt." },
      { id: "p3-04-q3", question: "When will the woman send the details?", options: ["Tonight", "Tomorrow", "Next week", "This morning"], answer: 1, explanation: "Cô ấy đặt phòng tối nay và gửi chi tiết vào ngày mai — đừng nhầm 2 mốc thời gian." },
    ],
  },
];

export const part4: Passage[] = [
  {
    id: "p4-01",
    title: "Thông báo ở sân bay",
    script:
      "Attention, passengers. Flight VN205 to Da Nang is delayed by thirty minutes because of bad weather. Please wait near gate twelve. We will make another announcement at four o'clock. Thank you for your patience.",
    questions: [
      { id: "p4-01-q1", question: "What is the purpose of the announcement?", options: ["To welcome new passengers", "To inform about a flight delay", "To cancel a flight", "To change a gate number"], answer: 1, explanation: "Mục đích là thông báo chuyến bay bị trễ, không phải hủy chuyến." },
      { id: "p4-01-q2", question: "How long is the delay?", options: ["Ten minutes", "Thirty minutes", "One hour", "Four hours"], answer: 1, explanation: "Trễ 30 phút vì thời tiết xấu." },
      { id: "p4-01-q3", question: "Where should passengers wait?", options: ["Near gate ten", "Near gate twelve", "At the ticket counter", "Outside the airport"], answer: 1, explanation: "Hành khách được yêu cầu đợi gần cổng 12." },
    ],
  },
  {
    id: "p4-02",
    title: "Tin nhắn thoại của cửa hàng",
    script:
      "Hello, this is Anna from Fresh Market. Your order will be delivered tomorrow between nine and eleven in the morning. Please make sure someone is at home. If you need to change the time, please call us before eight tonight.",
    questions: [
      { id: "p4-02-q1", question: "Who is speaking?", options: ["A delivery driver", "Anna from Fresh Market", "A hotel worker", "A bank officer"], answer: 1, explanation: "Người nói tự giới thiệu: Anna from Fresh Market." },
      { id: "p4-02-q2", question: "When will the order be delivered?", options: ["Tonight", "Tomorrow between nine and eleven", "Next Monday", "This afternoon"], answer: 1, explanation: "Giao hàng sáng mai từ 9 đến 11 giờ." },
      { id: "p4-02-q3", question: "What should listeners do if they want to change the time?", options: ["Send an email tomorrow", "Call before eight tonight", "Visit the store", "Wait for another message"], answer: 1, explanation: "Muốn đổi giờ thì gọi trước 8 giờ tối nay." },
    ],
  },
  {
    id: "p4-03",
    title: "Thông báo trong công ty",
    script:
      "Good morning, everyone. Please remember that the office will close early this Friday, at three o'clock, for building maintenance. Please save your work and turn off your computers before you leave. Normal hours will return on Monday.",
    questions: [
      { id: "p4-03-q1", question: "Why will the office close early?", options: ["For a holiday", "For building maintenance", "For a company party", "For staff training"], answer: 1, explanation: "Đóng sớm vì bảo trì tòa nhà, không phải nghỉ lễ." },
      { id: "p4-03-q2", question: "What time will the office close on Friday?", options: ["At noon", "At three o'clock", "At five o'clock", "At six o'clock"], answer: 1, explanation: "Thứ Sáu đóng lúc 3 giờ chiều." },
      { id: "p4-03-q3", question: "What are employees asked to do?", options: ["Work from home", "Save work and turn off computers", "Bring their laptops home", "Arrive early on Monday"], answer: 1, explanation: "Nhân viên được nhắc lưu công việc và tắt máy trước khi về." },
    ],
  },
];

export const dictation = [
  { id: "d-01", text: "The meeting starts at nine o'clock." },
  { id: "d-02", text: "Please send the report before Friday." },
  { id: "d-03", text: "The new office is on the third floor." },
  { id: "d-04", text: "Mr. Lee will pick up the client at the airport." },
  { id: "d-05", text: "The store closes at nine this evening." },
  { id: "d-06", text: "Can you book a hotel near the office?" },
  { id: "d-07", text: "The package will arrive tomorrow morning." },
  { id: "d-08", text: "Please save your work before you leave." },
  { id: "d-09", text: "The training starts next Monday at ten." },
  { id: "d-10", text: "I will send a new invitation today." },
];

export type VocabWord = { word: string; vi: string; example: string; topic: string };

export const vocab: VocabWord[] = [
  { word: "schedule", vi: "lịch trình", example: "Please check the schedule for Friday.", topic: "Meeting" },
  { word: "meeting", vi: "cuộc họp", example: "The meeting starts at nine.", topic: "Meeting" },
  { word: "appointment", vi: "cuộc hẹn", example: "I have an appointment at ten.", topic: "Meeting" },
  { word: "reschedule", vi: "dời lịch", example: "We need to reschedule the meeting.", topic: "Meeting" },
  { word: "deadline", vi: "hạn chót", example: "The deadline is Friday at noon.", topic: "Meeting" },
  { word: "agenda", vi: "chương trình họp", example: "Please read the agenda before the meeting.", topic: "Meeting" },
  { word: "confirm", vi: "xác nhận", example: "Please confirm the time by email.", topic: "Meeting" },
  { word: "postpone", vi: "hoãn lại", example: "They decided to postpone the event.", topic: "Meeting" },
  { word: "attend", vi: "tham dự", example: "Will you attend the training?", topic: "Meeting" },
  { word: "arrange", vi: "sắp xếp", example: "I will arrange a taxi for you.", topic: "Meeting" },
  { word: "report", vi: "báo cáo", example: "Please send the report today.", topic: "Office" },
  { word: "document", vi: "tài liệu", example: "This document is very important.", topic: "Office" },
  { word: "printer", vi: "máy in", example: "The printer is on the second floor.", topic: "Office" },
  { word: "keyboard", vi: "bàn phím", example: "My keyboard is not working.", topic: "Office" },
  { word: "colleague", vi: "đồng nghiệp", example: "My colleague will help you.", topic: "Office" },
  { word: "manager", vi: "quản lý", example: "Please ask the manager.", topic: "Office" },
  { word: "department", vi: "phòng ban", example: "She works in the sales department.", topic: "Office" },
  { word: "supervisor", vi: "người giám sát", example: "The supervisor approved the plan.", topic: "Office" },
  { word: "assignment", vi: "nhiệm vụ được giao", example: "This is your new assignment.", topic: "Office" },
  { word: "signature", vi: "chữ ký", example: "Please sign your name here.", topic: "Office" },
  { word: "email", vi: "thư điện tử", example: "I sent you an email this morning.", topic: "Email" },
  { word: "attachment", vi: "tệp đính kèm", example: "Please see the attachment.", topic: "Email" },
  { word: "inbox", vi: "hộp thư đến", example: "Check your inbox for my message.", topic: "Email" },
  { word: "forward", vi: "chuyển tiếp", example: "Please forward this email to Anna.", topic: "Email" },
  { word: "reply", vi: "trả lời", example: "I will reply tomorrow.", topic: "Email" },
  { word: "subject", vi: "tiêu đề", example: "Write a clear subject line.", topic: "Email" },
  { word: "password", vi: "mật khẩu", example: "Do not share your password.", topic: "Email" },
  { word: "download", vi: "tải xuống", example: "Please download the file.", topic: "Email" },
  { word: "upload", vi: "tải lên", example: "Upload the photo to the system.", topic: "Email" },
  { word: "website", vi: "trang web", example: "Visit our website for details.", topic: "Email" },
  { word: "flight", vi: "chuyến bay", example: "My flight leaves at eight.", topic: "Travel" },
  { word: "airport", vi: "sân bay", example: "Please arrive at the airport early.", topic: "Travel" },
  { word: "ticket", vi: "vé", example: "I bought a train ticket.", topic: "Travel" },
  { word: "delay", vi: "sự chậm trễ / bị trễ", example: "The flight is delayed by thirty minutes.", topic: "Travel" },
  { word: "luggage", vi: "hành lý", example: "My luggage is heavy.", topic: "Travel" },
  { word: "platform", vi: "sân ga", example: "The train leaves from platform three.", topic: "Travel" },
  { word: "reservation", vi: "đặt chỗ", example: "I have a reservation for two nights.", topic: "Travel" },
  { word: "check-in", vi: "làm thủ tục nhận phòng / lên máy bay", example: "Check-in starts at two o'clock.", topic: "Travel" },
  { word: "passenger", vi: "hành khách", example: "Passengers, please wait near the gate.", topic: "Travel" },
  { word: "destination", vi: "điểm đến", example: "Da Nang is our destination.", topic: "Travel" },
  { word: "hotel", vi: "khách sạn", example: "The hotel is near the office.", topic: "Hotel" },
  { word: "reception", vi: "quầy lễ tân", example: "Please go to the reception desk.", topic: "Hotel" },
  { word: "room", vi: "phòng", example: "Your room is on the fifth floor.", topic: "Hotel" },
  { word: "guest", vi: "khách", example: "The guest asked for extra towels.", topic: "Hotel" },
  { word: "breakfast", vi: "bữa sáng", example: "Breakfast is served from seven to nine.", topic: "Hotel" },
  { word: "available", vi: "còn trống / sẵn có", example: "Is a room available tonight?", topic: "Hotel" },
  { word: "checkout", vi: "trả phòng", example: "Checkout time is twelve noon.", topic: "Hotel" },
  { word: "lobby", vi: "sảnh", example: "Please wait in the lobby.", topic: "Hotel" },
  { word: "elevator", vi: "thang máy", example: "Take the elevator to the third floor.", topic: "Hotel" },
  { word: "discount", vi: "giảm giá", example: "There is a ten percent discount today.", topic: "Money" },
  { word: "price", vi: "giá", example: "What is the price of this ticket?", topic: "Money" },
  { word: "payment", vi: "thanh toán", example: "Payment is due on Friday.", topic: "Money" },
  { word: "receipt", vi: "hóa đơn / biên lai", example: "Please keep the receipt.", topic: "Money" },
  { word: "refund", vi: "hoàn tiền", example: "You can get a refund within seven days.", topic: "Money" },
  { word: "budget", vi: "ngân sách", example: "We need to stay within the budget.", topic: "Money" },
  { word: "invoice", vi: "hóa đơn (doanh nghiệp)", example: "Please send the invoice this week.", topic: "Money" },
  { word: "salary", vi: "lương", example: "Salaries are paid on the fifth.", topic: "Money" },
  { word: "expense", vi: "chi phí", example: "Travel expenses must be approved.", topic: "Money" },
  { word: "charge", vi: "phí / tính phí", example: "There is no extra charge.", topic: "Money" },
  { word: "customer", vi: "khách hàng", example: "The customer is waiting outside.", topic: "Shop" },
  { word: "product", vi: "sản phẩm", example: "This product is very popular.", topic: "Shop" },
  { word: "store", vi: "cửa hàng", example: "The store closes at nine.", topic: "Shop" },
  { word: "purchase", vi: "mua / sự mua hàng", example: "Thank you for your purchase.", topic: "Shop" },
  { word: "delivery", vi: "giao hàng", example: "Delivery takes two days.", topic: "Shop" },
  { word: "package", vi: "gói hàng", example: "Your package will arrive tomorrow.", topic: "Shop" },
  { word: "warehouse", vi: "kho hàng", example: "The package is in the warehouse.", topic: "Shop" },
  { word: "supplier", vi: "nhà cung cấp", example: "We called the supplier yesterday.", topic: "Shop" },
  { word: "order", vi: "đơn hàng / đặt hàng", example: "I would like to place an order.", topic: "Shop" },
  { word: "return", vi: "trả lại", example: "You can return the item within a week.", topic: "Shop" },
  { word: "maintain", vi: "bảo trì", example: "We maintain the building every year.", topic: "Work" },
  { word: "repair", vi: "sửa chữa", example: "They are repairing the road.", topic: "Work" },
  { word: "install", vi: "lắp đặt", example: "Please install the new printer.", topic: "Work" },
  { word: "operate", vi: "vận hành", example: "This machine is easy to operate.", topic: "Work" },
  { word: "safety", vi: "an toàn", example: "Safety comes first.", topic: "Work" },
  { word: "equipment", vi: "thiết bị", example: "Check the equipment before use.", topic: "Work" },
  { word: "construction", vi: "xây dựng", example: "Construction starts in June.", topic: "Work" },
  { word: "announcement", vi: "thông báo", example: "Please listen to the announcement.", topic: "Work" },
  { word: "audience", vi: "khán giả / người nghe", example: "The audience enjoyed the talk.", topic: "Work" },
  { word: "presentation", vi: "bài thuyết trình", example: "Her presentation was very clear.", topic: "Work" },
  { word: "overtime", vi: "làm thêm giờ", example: "Overtime is paid at the end of the month.", topic: "Work" },
];

export type CarItem = { id: string; title: string; speak: string; answerSpeak: string };

export function buildCarItems(): CarItem[] {
  const items: CarItem[] = [];
  part2.slice(0, 12).forEach((q) => {
    items.push({
      id: `car-${q.id}`,
      title: `Part 2 — ${q.question}`,
      speak: q.question,
      answerSpeak: `The correct answer is: ${q.options[q.answer]}. ${q.explanation}`,
    });
  });
  part1.slice(0, 6).forEach((p) => {
    items.push({
      id: `car-${p.id}`,
      title: `Part 1 — ${p.scene}`,
      speak: `Look at the picture. ${p.statements.join(" ")}`,
      answerSpeak: `The correct statement is: ${p.statements[p.answer]}`,
    });
  });
  vocab.slice(0, 10).forEach((v) => {
    items.push({
      id: `car-vocab-${v.word}`,
      title: `Từ vựng — ${v.word}`,
      speak: `${v.word}. ${v.example} Please repeat after me: ${v.word}.`,
      answerSpeak: `${v.word} means ${v.vi}.`,
    });
  });
  return items;
}
