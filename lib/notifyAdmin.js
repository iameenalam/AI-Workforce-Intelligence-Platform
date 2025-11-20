import { Notification } from "../models/Notification";
import { Organization } from "../models/Organization";

export async function notifyAdminEmployeeJoined({
  organizationId,
  employeeId,
  employeeName,
  employeeEmail,
}) {
  const org = await Organization.findById(organizationId).populate("user");
  if (!org || !org.user) return;

  await Notification.create({
    title: "New Employee Joined",
    message: `${employeeName} (${employeeEmail}) has joined your organization.`,
    type: "general",
    user: org.user._id,
    organization: organizationId,
    employee: employeeId,
    data: { employeeName, employeeEmail },
  });
}
