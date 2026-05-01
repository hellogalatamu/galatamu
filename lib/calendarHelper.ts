"use client";

export function generateGoogleCalendarLink(title: string, date: string, location: string) {
  const startDate = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent("Mohon doa restu dan kehadiran Bapak/Ibu/Saudara/i.")}&location=${encodeURIComponent(location)}`;
}

export function generateICalLink(title: string, date: string, location: string) {
  const startDate = new Date(date).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endDate = new Date(new Date(date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  const icalData = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `LOCATION:${location}`,
    "DESCRIPTION:Mohon doa restu dan kehadiran Bapak/Ibu/Saudara/i.",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\n");

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icalData)}`;
}
