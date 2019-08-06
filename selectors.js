const baseSelector = "td[width='632']";
const getTableForSelector = tableNumber => `table:nth-of-type(${tableNumber})`;
const getRowSelector = rowNumber => `tr:nth-of-type(${rowNumber})`;
const getCellSelector = cellNumber => `td:nth-of-type(${cellNumber})`;

const subjectMatterRegistrationTable = getTableForSelector(2);
const seniorOfficerTable = getTableForSelector(4);
const subjectMatterTable = getTableForSelector(6);
const lobbyistsOnSubjectMatterTable = getTableForSelector(8);
const otherBeneficiaries = getTableForSelector(10);
const nonGovtFinancialContributors = getTableForSelector(12);
const govtFinancing = getTableForSelector(14);
const publicOfficeAndCommsMethods = getTableForSelector(17);
const grassRootsComms = getTableForSelector(18);
const orgCommitteeComms = getTableForSelector(19);

// Subject matter registration

const subjectMatterRegNumber = `${baseSelector} ${subjectMatterRegistrationTable} ${getRowSelector(
  2
)} ${getCellSelector(3)}`;

const subjectMatterRegStatus = `${baseSelector} ${subjectMatterRegistrationTable} ${getRowSelector(
  2
)} ${getCellSelector(5)}`;

const initialRegistrationApproval = `${baseSelector} ${subjectMatterRegistrationTable} ${getRowSelector(
  2
)} ${getCellSelector(7)}`;

const latestRegistrationApproval = `${baseSelector} ${subjectMatterRegistrationTable} ${getRowSelector(
  2
)} ${getCellSelector(9)}`;

// Senior Officer

const seniorOfficer = `${baseSelector} ${subjectMatterRegistrationTable} ${getRowSelector(
  2
)} ${getCellSelector(3)}`;

module.exports = {
  subjectMatterRegNumber,
  subjectMatterRegStatus,
  initialRegistrationApproval,
  latestRegistrationApproval,
};
