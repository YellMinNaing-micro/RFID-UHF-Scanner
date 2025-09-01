import { NativeModules } from 'react-native';

const { UhfModule } = NativeModules;

export const readTag = async (): Promise<string> => {
    return await UhfModule.readTag();
};

export const writeTag = async (data: string): Promise<string> => {
    return await UhfModule.writeTag(data);
};
