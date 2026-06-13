import { RequestStatus } from "@prisma/client";

/** All request statuses available for selection in the admin UI. */
export function getRequestStatusesSelectableInAdmin(): RequestStatus[] {
  return Object.values(RequestStatus) as RequestStatus[];
}

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  [RequestStatus.NEW]: "New",
  [RequestStatus.FULFILLED]: "Fulfilled",
  [RequestStatus.CONTACTED]: "Contacted",
  [RequestStatus.UNCLAIMED]: "Unclaimed",
  [RequestStatus.REDISTRIBUTED]: "Redistributed",
};
