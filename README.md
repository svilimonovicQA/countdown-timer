# 🕐 Countdown Timer App

A modern, responsive countdown timer application built with vanilla JavaScript, HTML, and CSS. Create multiple countdown timers for your important events and never miss a moment!

## ✨ Features

### Core Features

- **Event Creation**: Add events with custom names, dates, and optional times
- **Real-time Countdown**: Live countdown display showing days, hours, minutes, and seconds
- **Input Validation**: Comprehensive validation with helpful error messages
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Clean UI**: Modern, intuitive interface with smooth animations

### Bonus Features

- **Persistent Storage**: Events are saved in localStorage and persist across browser sessions
- **Multiple Events**: Create and manage multiple countdown timers simultaneously
- **Event Notifications**: Browser notifications and alerts when events are reached
- **Event Management**: Delete individual events or clear all events
- **Automatic Updates**: Countdowns update in real-time with smooth animations
- **Completed Events**: Special styling and messaging for completed events

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies or installations required

### Installation

1. Clone this repository or download the files
2. Open `index.html` in your web browser
3. Start creating countdown timers!

### Usage

1. **Create an Event**:

   - Enter an event name (required)
   - Select a date (required)
   - Optionally set a specific time (defaults to midnight)
   - Click "Start Countdown"

2. **Manage Events**:

   - View all active countdowns in the main area
   - Delete individual events using the "Delete" button
   - Events are automatically saved and will persist when you reload the page

3. **Event Completion**:
   - When an event time is reached, you'll receive a notification
   - The countdown card will change to a completed state
   - An alert will notify you that the event has arrived

## 🛠️ Technical Details

### Built With

- **HTML5**: Semantic markup and modern form elements
- **CSS3**: Flexbox, Grid, animations, and responsive design
- **Vanilla JavaScript**: ES6+ features, classes, and modern APIs

### Key Technologies Used

- **LocalStorage API**: For persistent data storage
- **Notification API**: For browser notifications
- **Date API**: For accurate time calculations
- **CSS Grid & Flexbox**: For responsive layouts
- **CSS Animations**: For smooth transitions and effects

### Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📁 Project Structure

```
countdown-timer/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality
├── README.md           # Project documentation
└── LICENSE             # MIT License
```

## 🎯 Features Implementation

### Input Validation

- Empty name detection
- Date format validation
- Past date prevention
- Future date limit (999 days maximum)
- Real-time error messaging

### Countdown Logic

- Precise time calculations using built-in JavaScript Date functions
- Real-time updates every second
- Automatic cleanup when events complete
- Smooth animations for value changes

### Data Persistence

- Events saved to localStorage automatically
- Data restored on page load
- Graceful error handling for storage issues

### Responsive Design

- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## 🔧 Customization

### Adding Custom Styles

Modify `style.css` to customize:

- Color schemes
- Typography
- Layout spacing
- Animation effects

### Extending Functionality

The modular JavaScript structure makes it easy to add:

- Different notification types
- Export/import functionality
- Recurring events
- Custom sound alerts

## 🐛 Known Limitations

- Browser notification permission required for full functionality
- Audio notifications may be blocked by browser autoplay policies
- Maximum countdown precision limited to 999 days
- Requires JavaScript enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the [App Ideas Collection](https://github.com/florinpop17/app-ideas)
- Built following modern web development best practices
- Designed with accessibility and usability in mind

## 📞 Support

If you encounter any issues or have questions:

1. Check the browser console for error messages
2. Ensure JavaScript is enabled
3. Try clearing localStorage if events aren't loading
4. Open an issue on GitHub for bug reports

---

**Enjoy counting down to your special moments! 🎉**
