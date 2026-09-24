const texts = {
  english: {
    easy: [
      "Typing is fun and easy.",
      "Practice every day to improve your speed.",
      "Keep your fingers on the keyboard.",
      "Good typing helps you save time."
    ],
    normal: [
      "Learning to type faster requires regular practice and patience.",
      "Good typing skills help students complete their work more quickly.",
      "Technology has changed the way people communicate, learn and work.",
      "Accuracy is important, so focus on typing the correct characters.",
      "Regular practice can improve both typing speed and confidence.",
      "A comfortable keyboard position can make typing easier.",
      "Try to look at the screen instead of the keyboard while typing.",
      "Small improvements every day can lead to better typing skills."
    ],
    hard: [
      "Accurate typing requires concentration, rhythm, consistency, and excellent coordination.",
      "Modern technology continues to transform communication, education, business, and everyday life.",
      "Professional typing requires speed while maintaining a high level of accuracy.",
      "Learning difficult words and punctuation can improve your overall keyboard skills.",
      "Consistent practice helps the brain remember common words and keyboard movements.",
      "Fast typing is useful for students, programmers, writers, office workers, and professionals.",
      "Good posture, correct finger placement, and regular practice can reduce typing mistakes.",
      "The ability to type accurately and quickly can save a significant amount of time."
    ]
  },

  nepali: {
    easy: [
      "टाइपिङ सजिलो र रमाइलो हुन्छ।",
      "दैनिक अभ्यास गर्नुहोस्।",
      "किबोर्डमा औंला सही राख्नुहोस्।",
      "राम्रो टाइपिङले समय बचत गर्छ।"
    ],
    normal: [
      "नियमित अभ्यास र धैर्यले टाइपिङको गति र शुद्धता सुधार गर्न सकिन्छ।",
      "राम्रो टाइपिङ सीपले विद्यार्थीलाई आफ्नो काम छिटो पूरा गर्न सहयोग गर्छ।",
      "प्रविधिले मानिसको जीवनलाई धेरै सजिलो बनाएको छ।",
      "टाइप गर्दा गति भन्दा पहिले शुद्धतामा ध्यान दिनु राम्रो हुन्छ।",
      "दैनिक अभ्यासले टाइपिङको गति र आत्मविश्वास दुवै बढाउन सक्छ।",
      "सही तरिकाले किबोर्ड प्रयोग गर्दा टाइपिङ गर्न अझ सजिलो हुन्छ।",
      "टाइप गर्दा सकेसम्म किबोर्डभन्दा स्क्रिनमा ध्यान दिनुहोस्।",
      "हरेक दिनको सानो सुधारले राम्रो टाइपिङ सीप विकास गर्न सहयोग गर्छ।"
    ],
    hard: [
      "प्रविधिको तीव्र विकाससँगै सूचना, सञ्चार, शिक्षा र व्यवसायका क्षेत्रमा नयाँ सम्भावनाहरू सिर्जना भइरहेका छन्।",
      "सही टाइपिङका लागि एकाग्रता, निरन्तर अभ्यास, गति र अक्षरहरूको शुद्धतामा विशेष ध्यान दिन आवश्यक हुन्छ।",
      "व्यावसायिक टाइपिङमा गति कायम राख्दै उच्च स्तरको शुद्धता हासिल गर्न आवश्यक हुन्छ।",
      "कठिन शब्दहरू, विराम चिन्हहरू र विभिन्न वाक्य संरचनाको अभ्यासले टाइपिङ सीप अझ राम्रो बनाउन सक्छ।",
      "निरन्तर अभ्यासले मस्तिष्कलाई सामान्य शब्दहरू र किबोर्डका अक्षरहरूको स्थान सम्झन सहयोग गर्छ।",
      "छिटो र सही टाइपिङ विद्यार्थी, प्रोग्रामर, लेखक, कार्यालय कर्मचारी र अन्य पेशेवरका लागि उपयोगी हुन्छ।",
      "सही बसाइ, औंलाको उचित स्थान र नियमित अभ्यासले टाइपिङका गल्तीहरू कम गर्न सहयोग गर्छ।",
      "शुद्ध र छिटो टाइप गर्ने क्षमताले दैनिक काममा महत्वपूर्ण समय बचत गर्न सक्छ।"
    ]
  }
};

let text = "";
let left = 60;
let timer = null;
let started = false;
let errors = 0;

const $ = id => document.getElementById(id);

function pick() {
  const lang = $("lang").value;
  const level = $("level").value;
  const paragraphs = texts[lang][level];

  text = paragraphs.join("\n");

  $("text").innerHTML = "";
  text.split("").forEach(char => {
    const span = document.createElement("span");
    span.textContent = char;
    $("text").appendChild(span);
  });
}

function formatTime(seconds) {
  return String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" + String(seconds % 60).padStart(2, "0");
}

function stats() {
  const value = $("input").value;
  errors = 0;

  [...$("text").children].forEach((span, index) => {
    span.className = "";

    if (value[index] != null) {
      if (value[index] === span.textContent) {
        span.className = "correct";
      } else {
        span.className = "wrong";
        errors++;
      }
    }
  });

  const elapsed = Number($("mins").value) - left;
  const wpm = elapsed
    ? Math.round(value.length / 5 / (elapsed / 60))
    : 0;

  const accuracy = value.length
    ? Math.round(((value.length - errors) / value.length) * 100)
    : 100;

  $("wpm").textContent = wpm;
  $("acc").textContent = accuracy + "%";
  $("err").textContent = errors;

  if (value.length >= text.length) finish();
}

function finish() {
  if (!started) return;

  started = false;
  clearInterval(timer);
  $("input").disabled = true;

  $("fw").textContent = $("wpm").textContent;
  $("fa").textContent = $("acc").textContent;
  $("fe").textContent = errors;
  $("result").style.display = "block";
  $("start").textContent = "▶ Start Test";
}

function start() {
  clearInterval(timer);

  left = Number($("mins").value);
  $("time").textContent = formatTime(left);
  $("result").style.display = "none";

  pick();
  $("input").value = "";
  $("input").disabled = false;
  $("input").focus();

  started = true;
  $("start").textContent = "⏳ Test Running...";

  timer = setInterval(() => {
    left--;
    $("time").textContent = formatTime(left);
    stats();

    if (left <= 0) finish();
  }, 1000);
}

$("start").onclick = start;
$("input").oninput = stats;

// Wrong characters cannot be deleted.
$("input").onkeydown = event => {
  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
  }
};

$("lang").onchange = () => {
  if (!started) pick();
};

$("level").onchange = () => {
  if (!started) pick();
};

$("mins").onchange = () => {
  if (!started) {
    left = Number($("mins").value);
    $("time").textContent = formatTime(left);
  }
};

$("theme").onclick = () => {
  document.body.classList.toggle("dark");
};

pick();
