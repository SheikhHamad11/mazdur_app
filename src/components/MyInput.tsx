/* eslint-disable react-native/no-inline-styles */
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import React, {ChangeEvent, useRef, useState} from 'react';
import AppText from './AppText';
import Icon from 'react-native-vector-icons/Ionicons';
// import {mvs} from '../../theme/responsive';
// import {colors} from '../../theme/colors';
// import {COMMON_STYLES} from '../../theme/globalStyles';
// import AnyIcon, {Icons} from '../AnyIcon';

interface Props extends TextInputProps {
  header?: string;
  multiLine?: boolean;
  location?: boolean;
  placeholder?: string;
  top?: number;
  isEye?: boolean;
  isPhone?: boolean;
  maxHeight?: number;
  minHeight?: number;
  leftIcon?: string;
  rightIcon?: string;
  disable?: boolean;
  onPressRightIcon?: () => void;
  selectPhoto?: boolean;
  rightIconWidth?: number;
  rightIconHeight?: number;
  onPress?: () => void;
  disableRightIcon?: boolean;
  containerStyle?: ViewStyle;
  onChangeText?: (e: string | ChangeEvent<any>) => void;
  onBlur?: (e: any) => void;
  value?: string;
  error?: any;
  isPassword?: boolean;
}

const MyInput: React.FC<Props> = ({
  header,
  multiLine,
  value,
  onBlur,
  disable = false,
  top = 18,
  placeholder,
  maxHeight = 150,
  onChangeText,
  isPhone = false,
  leftIcon,
  minHeight = 130,
  containerStyle,
  isPassword,
  error,
  ...props
}) => {
  const [eye, seteye] = useState(true);

  const multiinput = {
    maxHeight: 300,
    minHeight: 100,
  };
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };
  return (
    <View style={{marginTop: 20, width: '100%', ...containerStyle}}>
      {header && (
        <AppText
          font='bold'
          style={{marginBottom: 5}}
          children={header}
        />
      )}

      <Pressable
        disabled={disable}
        onPress={handleClick}
        style={[
          multiLine ? styles.multiline : styles.input,
          {...(multiLine && multiinput)},
          disable && {backgroundColor: 'gray'},
        ]}>
        {isPhone && <AppText  font='medium' children={'+92'} />}

        <TextInput
          editable={!disable}
          ref={inputRef}
          value={value}
          style={{
            flex: 1,
            maxHeight:(multiLine ? 300 : 48),
            fontSize: 16,
            color: 'black',
          }}
          secureTextEntry={isPassword && eye}
          multiline={multiLine}
          onBlur={onBlur}
          onChangeText={onChangeText}
          placeholderTextColor={'gray'}
          placeholder={placeholder || 'Placeholder'}
          {...props}
        />
        {isPassword && (
          <Icon
            onPress={() => seteye(!eye)}
            name={eye ? 'eye-off' : 'eye'}
            size={20}
            color={'black'}
           
          />
        )}
      </Pressable>
      {error && <FormikError error={error} />}
    </View>
  );
};

export default MyInput;
interface ErrorProps {
  error?: any;
}
export const FormikError = ({error}: ErrorProps) => {
  return (
    <AppText style={{color:"red"}} font='medium'  >
      {error}
    </AppText>
  );
};
const styles = StyleSheet.create({
  multiline: {
    paddingHorizontal: 10,
    flex: 1,
    borderColor: '#aaa',
    borderWidth: 1,
    marginTop: 5,
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    height: 48,
    borderRadius: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#aaa',
    borderWidth: 1,
  },
});

