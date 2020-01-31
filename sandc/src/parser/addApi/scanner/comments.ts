export default interface Comment {
  source: string;
  location: PointLocation;
}

interface PointLocation {
  line: number;
  column: number;
}
