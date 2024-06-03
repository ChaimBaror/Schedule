export const generateFiveMinutes = (dateString: string | Date, minutesToAdd: string = '0') => {
    const date = new Date(dateString);
    // Add minutes
    date.setMinutes(date.getMinutes() + parseInt(minutesToAdd));
  
    // Round minutes to the nearest multiple of 5
    const roundedMinutes = Math.ceil(date.getMinutes() / 5) * 5;
    date.setMinutes(roundedMinutes);
  
    // Format the time as "HH:MM"
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  };

  export const formatTime = (dateString: string | Date, minutesToAdd: string = '0') => {
    const date = new Date(dateString);
    // Add minutes
    date.setMinutes(date.getMinutes() + parseInt(minutesToAdd));
  
    // Format the time as "HH:MM"
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  };
  