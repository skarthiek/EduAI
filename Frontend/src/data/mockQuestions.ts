import { Question } from '../types/quiz';

export const questionBank: Record<string, Question[]> = {
  "JavaScript": [
    {
      id: "js1",
      question: "What is the output of typeof null in JavaScript?",
      options: ["null", "undefined", "object", "string"],
      correctAnswer: 2,
      explanation: "In JavaScript, typeof null returns 'object'. This is a well-known bug in JavaScript that has been kept for backward compatibility."
    },
    {
      id: "js2",
      question: "Which method is used to add an element to the end of an array?",
      options: ["push()", "pop()", "shift()", "unshift()"],
      correctAnswer: 0,
      explanation: "The push() method adds one or more elements to the end of an array and returns the new length of the array."
    },
    {
      id: "js3",
      question: "What does the '===' operator do in JavaScript?",
      options: ["Checks equality with type coercion", "Checks strict equality without type coercion", "Assigns a value", "Checks if not equal"],
      correctAnswer: 1,
      explanation: "The '===' operator checks for strict equality, meaning both value and type must be the same. It does not perform type coercion."
    }
  ],
  "React": [
    {
      id: "react1",
      question: "What is JSX in React?",
      options: ["A new JavaScript version", "A syntax extension for JavaScript", "A CSS framework", "A testing library"],
      correctAnswer: 1,
      explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files. It gets compiled to regular JavaScript."
    },
    {
      id: "react2",
      question: "Which hook is used to manage component state?",
      options: ["useEffect", "useState", "useContext", "useReducer"],
      correctAnswer: 1,
      explanation: "useState is the React hook used to add state to functional components. It returns an array with the current state and a setter function."
    },
    {
      id: "react3",
      question: "What is the purpose of useEffect hook?",
      options: ["To manage state", "To handle side effects", "To create context", "To optimize performance"],
      correctAnswer: 1,
      explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM."
    }
  ],
  "HTML": [
    {
      id: "html1",
      question: "Which HTML tag is used for the largest heading?",
      options: ["<h6>", "<h1>", "<header>", "<title>"],
      correctAnswer: 1,
      explanation: "The <h1> tag represents the largest heading in HTML. Headings range from <h1> (largest) to <h6> (smallest)."
    },
    {
      id: "html2",
      question: "What does the 'alt' attribute do in an img tag?",
      options: ["Sets the image size", "Provides alternative text", "Changes the image format", "Sets the image alignment"],
      correctAnswer: 1,
      explanation: "The 'alt' attribute provides alternative text for an image if it cannot be displayed. It's important for accessibility and SEO."
    },
    {
      id: "html3",
      question: "Which tag is used to create a hyperlink?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correctAnswer: 1,
      explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML. The 'href' attribute specifies the URL of the page the link goes to."
    }
  ],
  "CSS": [
    {
      id: "css1",
      question: "Which property is used to change the text color?",
      options: ["text-color", "color", "font-color", "text-style"],
      correctAnswer: 1,
      explanation: "The 'color' property is used to set the color of text in CSS."
    },
    {
      id: "css2",
      question: "What does 'display: flex' do?",
      options: ["Makes element invisible", "Creates a flexible layout", "Sets fixed positioning", "Changes font size"],
      correctAnswer: 1,
      explanation: "The 'display: flex' property makes an element a flex container, enabling flexible layout for its children elements."
    },
    {
      id: "css3",
      question: "Which unit is relative to the font size of the element?",
      options: ["px", "em", "vh", "%"],
      correctAnswer: 1,
      explanation: "'em' is a relative unit that is equal to the current font size of the element. 1em = current font size."
    }
  ]
};

export const getRandomQuestions = (topic: string, count: number = 3): Question[] => {
  const questions = questionBank[topic] || [];
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getAvailableTopics = (): string[] => {
  return Object.keys(questionBank);
};