import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Button,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import CheckBox from "expo-checkbox";
import Map from "~/src/components/Map";
import { SafeAreaView } from "react-native-safe-area-context";
import { setPickupLocation } from "~/src/slices/location";
import { router } from "expo-router";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number is not valid")
    .min(10, "Phone number is too short")
    .max(15, "Phone number is too long"),
  houseApartment: Yup.string(),
  addressType: Yup.string().required("Address type is required"),
  otherName: Yup.string().when("addressType", ([addressType]) => {
    if (addressType === "Other") {
      return Yup.string().required("Please specify the address type");
    }
    return Yup.string();
  }),
});

export default function AddressDetails() {
  const pickUpLocation = useSelector(
    (state: {
      location: {
        pickup: { latitude: number; longitude: number; placeName: string };
      };
    }) => state.location.pickup
  );
  const dispatch = useDispatch();
  const [isOther, setIsOther] = useState(false);

  return (
    <SafeAreaView>
      <View className="h-1/2 bg-black">
        <Map location={pickUpLocation} />
      </View>
      <View className="h-1/2">
        <View className="p-2 flex flex-row items-center justify-around border-b border-gray-400">
          <Text
            className="font-semibold w-[75%]"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {pickUpLocation.placeName}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="border border-gray-700 p-1 rounded-md"
          >
            <Text className="text-blue-500 text-xs font-semibold">Change</Text>
          </Pressable>
        </View>
        <Formik
          initialValues={{
            houseApartment: "",
            name: "",
            phoneNumber: "",
            addressType: "",
            otherName: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            dispatch(
              setPickupLocation({
                ...pickUpLocation,
                phoneNumber: values.phoneNumber,
                name: values.name,
                houseNumberPlate: values.houseApartment,
                addressType: values.addressType,
              })
            );
            router.push("/(app)/(tabs)/(home)/");
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <View className="p-4">
              {/* House/Apartment (Optional) */}
              <TextInput
                className="border p-2 mb-4 rounded-md"
                placeholder="House/Apartment (Optional)"
                value={values.houseApartment}
                onChangeText={handleChange("houseApartment")}
                onBlur={handleBlur("houseApartment")}
              />

              {/* Name */}
              <TextInput
                className="border p-2 mb-4 rounded-md"
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {touched.name && errors.name && (
                <Text className="text-red-500 mb-2">{errors.name}</Text>
              )}

              {/* Phone Number */}
              <TextInput
                className="border p-2 mb-4 rounded-md"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text className="text-red-500 mb-2">{errors.phoneNumber}</Text>
              )}

              {/* Address Type Checkboxes */}
              <Text className="mb-4">Save as:</Text>
              <View className="flex flex-row space-x-3">
                <View className="flex flex-row items-center mb-4">
                  <CheckBox
                    value={values.addressType === "Home"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Home");
                      setIsOther(false);
                      setFieldValue("otherName", "");
                    }}
                  />
                  <Text className="ml-4">Home</Text>
                </View>

                <View className="flex flex-row items-center mb-4">
                  <CheckBox
                    value={values.addressType === "Shop"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Shop");
                      setIsOther(false);
                      setFieldValue("otherName", "");
                    }}
                  />
                  <Text className="ml-4">Shop</Text>
                </View>

                <View className="flex flex-row items-center mb-4">
                  <CheckBox
                    value={values.addressType === "Other"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Other");
                      setIsOther(true);
                    }}
                  />
                  <Text className="ml-4">Other</Text>
                </View>
              </View>
              {/* If "Other" is selected, show additional input field */}
              {isOther && (
                <>
                  <TextInput
                    className="border p-2 mb-4 rounded-md"
                    placeholder="Specify address type"
                    value={values.otherName}
                    onChangeText={handleChange("otherName")}
                    onBlur={handleBlur("otherName")}
                  />
                  {touched.otherName && errors.otherName && (
                    <Text className="text-red-500 mb-2">
                      {errors.otherName}
                    </Text>
                  )}
                </>
              )}

              {/* Submit Button */}
              <Button title="Submit" onPress={() => handleSubmit()} />
            </View>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
}
