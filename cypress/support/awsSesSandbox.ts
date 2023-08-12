// per https://docs.aws.amazon.com/ses/latest/dg/send-an-email-from-console.html#send-email-simulator
export const addrs = {
  success: "success@simulator.amazonses.com", // for use with Amazon SNS, see https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity-using-notifications.html
  bounce: "bounce@simulator.amazonses.com", // also received via (email or) SNS https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity-using-notifications.html
  ooto: "ooto@simulator.amazonses.com", // automatically responds (I imagine to respond-to: or from: value) https://tools.ietf.org/html/rfc3834
  complaint: "complaint@simulator.amazonses.com", // someone marks it spam; similar SNS delivery as above but https://tools.ietf.org/html/rfc5965
  suppressionList: "suppressionlist@simulator.amazonses.com", // SES generates a hard bounce as though addr were on AWS global suppression list
};
