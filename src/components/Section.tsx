import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View, ViewStyle, useColorScheme } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
    title?: string;
    isCenter?: boolean;
    narrow?: boolean;
  }>;
  
function Section({children, title, isCenter, narrow}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.sectionContainer, isCenter && styles.sectionCenter]}>
      <View style={[styles.innerView, narrow && styles.narrowView]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        {children ? <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
              textAlign: 'center',
            },
          ]}>
          {children}
        </Text>
        : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  sectionCenter:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerView:{
    alignItems: 'center',
  },
  narrowView:{
    width: '70%'
  }
});
  

export default Section;