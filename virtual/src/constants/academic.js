// Shared faculty/department taxonomy — previously duplicated inline inside
// AddDashboard.jsx. Centralized so the registration form and the notice
// form can't drift out of sync with each other.
export const FACULTIES = [
  'Faculty of Arts',
  'Faculty of Science',
  'Faculty of Social Sciences',
  'Faculty of Law',
  'Faculty of Engineering',
  'Faculty of Management Sciences',
  'Faculty of Education',
  'Faculty of Medicine',
];

export const DEPARTMENTS_BY_FACULTY = {
  'Faculty of Arts': ['Department of English', 'Department of History', 'Department of Philosophy'],
  'Faculty of Science': ['Department of Computer Science', 'Department of Mathematics', 'Department of Physics'],
  'Faculty of Social Sciences': ['Department of Economics', 'Department of Political Science', 'Department of Psychology'],
  'Faculty of Law': [],
  'Faculty of Engineering': [],
  'Faculty of Management Sciences': [],
  'Faculty of Education': [],
  'Faculty of Medicine': [],
};
