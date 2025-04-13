/* eslint-disable @typescript-eslint/no-explicit-any */
type RoomData = {
  id: string;
  createdAt: Date;
  content?: any; // Hoặc định nghĩa kiểu cụ thể cho dữ liệu couple
};

const rooms = new Map<string, RoomData>();

export const createRoom = (): RoomData => {
  const id = Math.random().toString(36).substring(2, 10);
  const newRoom = {
    id,
    createdAt: new Date(),
    content: {}, // Dữ liệu khởi tạo
  };
  rooms.set(id, newRoom);
  return newRoom;
};

export const getRoom = (id: string): RoomData | undefined => {
  return rooms.get(id);
};

export const updateRoom = (id: string, content: any): boolean => {
  if (!rooms.has(id)) return false;
  rooms.get(id)!.content = content;
  return true;
};
