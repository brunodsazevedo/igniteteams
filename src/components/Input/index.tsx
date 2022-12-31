import React from 'react';
import { TextInputProps, TextInput } from 'react-native';
import { useTheme } from 'styled-components/native';

import {
  Container,
} from './styles';

type Props = TextInputProps & {
  inputRef?: React.RefObject<TextInput>
}

export function Input({ ...rest }: Props) {
  const theme = useTheme();
  
  return (
    <Container
      placeholderTextColor={theme.COLORS.GRAY_300}
      {...rest}
    />
  );
}
