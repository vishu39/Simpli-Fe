import {cloneDeep} from 'lodash'

export let cardsDataArray = [
  {
    name: "Query",
    desc: "Count represents the number of queries added",
    icon: "query_stats",
    iconBg: "rgb(21, 96, 189)",
    value: 0,
    event: "queryCount",
    isShown: true,
    keyType: "query",
    isLoading: false
  },
  {
    name: "Opinion",
    desc: "Count represents the number of Opinion Sent",
    icon: "local_activity",
    iconBg: "rgb(218, 1, 45)",
    value: "0",
    event: "avgOpinionTime",
    isShown: true,
    keyType: "opinion",
    isLoading: false
  },
  {
    name: "VIL",
    desc: "Count represents the number of the VIL Sent",
    icon: "flight_takeoff",
    iconBg: "#ffbf00",
    value: 0,
    event: "vilCount",
    isShown: true,
    keyType: "vil",
    isLoading: false
  },
  {
    name: "Confirmation",
    desc: "Count represents the number of the Confirmation Received",
    icon: "person_add",
    iconBg: "#439946",
    value: 0,
    event: "confirmationCount",
    isShown: true,
    keyType: "confirmation",
    isLoading: false
  },
  {
    name: "Pending Query",
    desc: "Count represents the number of pending queries (Pending reverted to Partner / Patient and awaiting revert from Doctor)",
    icon: "person_add",
    iconBg: "rgb(218, 1, 45)",
    value: 0,
    event: "confirmationCount",
    isShown: true,
    keyType: "pendingQuery",
    isLoading: false
  },
  {
    name: "Open Follow Up",
    desc: "Count represents the number of pending follow-up tasks to be done (Till Date)",
    icon: "flight_takeoff",
    iconBg: "#ffbf00",
    value: 0,
    event: "vilCount",
    isShown: true,
    keyType: "openFollowUp",
    isLoading: false
  },
  {
    name: "Upcoming Arrival",
    desc: "Count represents the number of upcoming Arrivals",
    icon: "local_activity",
    iconBg: "rgb(67, 153, 70)",
    value: "0",
    event: "avgOpinionTime",
    isShown: true,
    keyType: "upcomingArrival",
    isLoading: false
  },
  {
    name: "On-Ground Patient",
    desc: "Count represents the number of On-Ground Patient",
    icon: "query_stats",
    iconBg: "rgb(21, 96, 189)",
    value: 0,
    event: "queryCount",
    isShown: true,
    keyType: "onGroundPatient",
    isLoading: false
  },
  {
    name: "Opinion To VIL",
    desc: "% represents the ratio of Queries where Opinion & VIL both sent",
    icon: "query_stats",
    iconBg: "rgb(255, 191, 0)",
    value: 0,
    event: "queryCount",
    isShown: true,
    keyType: "opinionToVil",
    isLoading: false
  },
  {
    name: "VIL To Confirmation",
    desc: "% represents the ratio of Queries where VIL Sent & Confirmation Received",
    icon: "local_activity",
    iconBg: "rgb(67, 153, 70)",
    value: "0",
    event: "avgOpinionTime",
    isShown: true,
    keyType: "vilToConfirmation",
    isLoading: false
  },
  {
    name: "Opinion To Confirmation",
    desc: "% represents the ratio of Queries where Opinion sent & Confirmation Received",
    icon: "flight_takeoff",
    iconBg: "rgb(21, 96, 189)",
    value: 0,
    event: "vilCount",
    isShown: true,
    keyType: "opinionToConfirmation",
    isLoading: false
  },
  {
    name: "VIL TAT",
    desc: "HH:MM represents the Turn Around Time (TAT) taken for VIL Sent to Partner / Patient since request has been received",
    icon: "person_add",
    iconBg: "rgb(218, 1, 45)",
    value: 0,
    event: "confirmationCount",
    isShown: true,
    keyType: "vilTat",
    isLoading: false
  },
  {
    name: "Opinion Assigned TAT",
    desc: "HH:MM represents the Turn Around Time (TAT) taken to Forward the Opinion request to the Doctor since it has been received",
    icon: "person_add",
    iconBg: "#439946",
    value: 0,
    event: "confirmationCount",
    isShown: true,
    keyType: "opinionAssignedTat",
    isLoading: false
  },
  {
    name: "Opinion Recd  TAT",
    desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Received from Doctor since it has been Forwarded",
    icon: "flight_takeoff",
    iconBg: "rgb(21, 96, 189)",
    value: 0,
    event: "vilCount",
    isShown: true,
    keyType: "opinionRecdTat",
    isLoading: false
  },
  {
    name: "Opinion Sent TAT",
    desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Sent to Partner  / Patient since it has been Received from Doctor",
    icon: "local_activity",
    iconBg: "rgb(218, 1, 45)",
    value: "0",
    event: "avgOpinionTime",
    isShown: true,
    keyType: "opinionSentTat",
    isLoading: false
  },
  {
    name: "Overall Opinion TAT",
    desc: "HH:MM represents the Turn Around Time (TAT) taken for Opinion Sent to Partner  / Patient since Request has been Received (from Partner / Patiet)",
    icon: "query_stats",
    iconBg: "rgb(255, 191, 0)",
    value: 0,
    event: "queryCount",
    isShown: true,
    keyType: "overallOpinionTat",
    isLoading: false
  },
];

export const modifyCardsData = (mainArray: any, hiddenArray: any) => {
  let clonedArray=cloneDeep(mainArray)
  hiddenArray.forEach((hA: any) => {
    let newIndex = clonedArray?.findIndex((mA: any) => mA?.keyType === hA?.keyType);
    if (newIndex !== -1) {
      clonedArray?.splice(newIndex, 1);
    }
  });

  return clonedArray;
};

export let YearArray = [
  { value: 2022, name: 2022 },
  { value: 2023, name: 2023 },
  { value: 2024, name: 2024 },
  { value: 2025, name: 2025 },
];

export let QuaterArray = [
  { value: "Q1", name: "Q1" },
  { value: "Q2", name: "Q2" },
  { value: "Q3", name: "Q3" },
  { value: "Q4", name: "Q4" },
];

export let GenderArray = [
  { value: "male", name: "Male" },
  { value: "female", name: "Female" },
  { value: "other", name: "Other" },
];

export let MonthArray = [
  { value: "jan", name: "January" },
  { value: "feb", name: "February" },
  { value: "mar", name: "March" },
  { value: "apr", name: "April" },
  { value: "may", name: "May" },
  { value: "jun", name: "June" },
  { value: "jul", name: "July" },
  { value: "aug", name: "August" },
  { value: "sep", name: "September" },
  { value: "oct", name: "October" },
  { value: "nov", name: "November" },
  { value: "dec", name: "December" },
];

export const updatedNaming = {
  lastUpdated: "Last Updated",
  queryAdded: "Query Added",
};

export const monthsNaming = {
  jan: "January",
  feb: "February",
  mar: "March",
  apr: "April",
  may: "May",
  jun: "June",
  jul: "July",
  aug: "August",
  sep: "September",
  oct: "October",
  nov: "November",
  dec: "December",
};

export const genderNaming = {
  male: "Male",
  female: "Female",
  other: "other",
};

export const quaterNaming = {
  Q1: "Q1",
  Q2: "Q2",
  Q3: "Q3",
  Q4: "Q4",
};

export const monthConstant= [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const genderLabelByCategory= {
  category0: "0 to 5",
  category1:  "6 to 11",
  category2:  "12 to 17",
  category3:  "18 to 29",
  category4:  "30 to 44",
  category5:  "45 to 59",
  category6:  "60 to 74",
  category7:  "75 above",
 }

const patientByStatusStaticData=[
  { name: "Opinion  Added/Sent", data: [10, 0, 0, 0, 0] },
  { name: "Opinion Received From Hospital", data: [15, 0, 0, 0, 0] },
  { name: "Request Assign To Hospital", data: [8, 0, 0, 0, 0] },
  { name: "Request Received", data: [5, 0, 0, 0, 0] },

  { name: "Request Received", data: [0, 12, 0, 0, 0] },
  { name: "Request Assign To Hospital", data: [0, 14, 0, 0, 0] },
  { name: "Revert Received From Hospital", data: [0, 7, 0, 0, 0] },
  { name: "Send To Patient/Partner", data: [0, 9, 0, 0, 0] },

  { name: "Request Received", data: [0, 0, 9, 0, 0] },
  { name: "Request Assign To Hospital", data: [0, 0, 11, 0, 0] },
  { name: "Revert Received From Hospital", data: [0, 0, 6, 0, 0] },
  { name: "Send To Patient/Partner", data: [0, 0, 7, 0, 0] },

  { name: "Request Received", data: [0, 0, 0, 14, 0] },
  { name: "Assign To Hospital", data: [0, 0, 0, 11, 0] },
  { name: "Received From Hospital", data: [0, 0, 0, 10, 0] },
  { name: "Send To Patient/Partner", data: [0, 0, 0, 6, 0] },

  { name: "Received", data: [0, 0, 0, 0, 7] },
  { name: "Confirmation Assign To Hospital", data: [0, 0, 0, 0, 12] },
  { name: "Assign To Hospital", data: [0, 0, 0, 0, 9] },
  { name: "Request Received", data: [0, 0, 0, 0, 9] },
]