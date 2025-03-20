import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  Bell,
  Download,
  Home,
  BarChart,
  HelpCircle,
  User,
  Edit,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: '#0077B6',
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            flex: 1,
          }}
        >
          PARAMOUNT
        </Text>
        <Bell color="white" size={24} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 20 }}
      >
        {/* Welcome Card */}
        <View
          style={{
            backgroundColor: '#DFF6FF',
            padding: 16,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, color: '#333' }}>
            Welcome, <Text style={{ fontWeight: 'bold' }}>Maxwell Sang!</Text>
          </Text>
          <Text style={{ fontWeight: 'bold', marginTop: 8 }}>Account:</Text>
          <Text style={{ fontWeight: 'bold' }}>Acc Number:</Text>
          <Text style={{ fontWeight: 'bold' }}>Balance:</Text>
          <Text style={{ fontWeight: 'bold' }}>Last Updated</Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#0077B6',
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 6 }}>
              Print statement
            </Text>
            <Download color="white" size={20} />
          </TouchableOpacity>
        </View>

        {/* Quick Links */}
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
          Quick Links
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}
        >
          {[
            'Usage & Billing',
            'Report an Issue',
            'Bill Calculator',
            'Customer Support',
          ].map((text, index) => (
            <TouchableOpacity
              key={index}
              style={{
                width: '48%',
                backgroundColor: '#5C9EAD',
                padding: 16,
                borderRadius: 8,
                marginBottom: 10,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Important Notices */}
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginVertical: 10 }}>
          Important Notices
        </Text>
        <View
          style={{ backgroundColor: '#DFF6FF', padding: 16, borderRadius: 10 }}
        >
          {[
            'Interruption of Water Supply from Naiberi Water Treatment Plant.',
            'Chebara Treatment Interruption NOV 2024.',
            'Kingongo Bondeni Water Pipeline Improvement Project.',
            'Maili Nne Water Pipeline NOV 2024',
          ].map((notice, index) => (
            <Text key={index} style={{ marginBottom: 6 }}>
              {notice}
            </Text>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          padding: 12,
          backgroundColor: '#E8F1F2',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {[
          { icon: Home, label: 'Home' },
          { icon: BarChart, label: 'Usage' },
          { icon: HelpCircle, label: 'Support' },
          { icon: User, label: 'Profile' },
        ].map((item, index) => (
          <TouchableOpacity key={index}>
            <item.icon size={24} color="#0077B6" />
            <Text
              style={{ color: '#0077B6', fontSize: 12, textAlign: 'center' }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 60,
          alignSelf: 'center',
          backgroundColor: '#0077B6',
          padding: 16,
          borderRadius: 50,
          elevation: 4,
        }}
      >
        <Edit color="white" size={24} />
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
