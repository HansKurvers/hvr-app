# React Countdown Timer

A performant React countdown component that meets the following requirements:
- Accepts an end date as parameter
- Counts down days, hours, minutes, and seconds
- Highly performant implementation
- Works without external libraries
- Includes clear comments
- Suitable for WordPress integration

## Usage

```jsx
import CountdownTimer from './CountdownTimer';

function App() {
  return (
    <CountdownTimer 
      endDate="2023-12-31T23:59:59" 
      onComplete={() => console.log('Countdown finished!')} 
      showSeconds={true}
      className="custom-countdown"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| endDate | string\|Date | required | The target date to count down to (ISO string or Date object) |
| onComplete | function | undefined | Optional callback function to run when countdown completes |
| showSeconds | boolean | true | Whether to display seconds |
| className | string | '' | Optional CSS class name for styling |

## Performance Features

- Uses React.memo to prevent unnecessary re-renders
- Implements useRef to minimize state updates
- Uses useCallback for function stability
- Efficient interval timing (1000ms updates)
- Proper cleanup on component unmount
- Handles browser performance with requestAnimationFrame

## WordPress Integration

To integrate this component in WordPress:

1. Include the component file in your WordPress theme or plugin
2. Register it as a React block or embed it in your theme
3. Custom styling can be applied via the className prop or by modifying the included CSS

## License

MIT