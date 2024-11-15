import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import CheckBox from "expo-checkbox";
import Map from "~/src/components/Map";
import { SafeAreaView } from "react-native-safe-area-context";
import { setDropoffLocation, setPickupLocation } from "~/src/slices/location";
import { router, useLocalSearchParams } from "expo-router";
import { Input } from "~/components/ui/input";

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
  const params = useLocalSearchParams<{ type: string }>();
  const pickUpLocation = useSelector(
    (state: {
      location: {
        pickup: { latitude: number; longitude: number; placeName: string };
      };
    }) => state.location.pickup
  );
  const dropOffLocation = useSelector(
    (state: {
      location: {
        dropoff: { latitude: number; longitude: number; placeName: string };
      };
    }) => state.location.dropoff
  );
  const dispatch = useDispatch();
  const [isOther, setIsOther] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Map Section */}
      <View className="h-1/2">
        <Map
          location={params.type === "drop" ? dropOffLocation : pickUpLocation}
        />
      </View>

      {/* Address Details Section */}
      <ScrollView className="flex-1 p-4">
        {/* Selected Location Display */}
        <View className="flex flex-row items-center justify-between p-4 mb-4 border-b border-gray-300">
          <Text
            className="font-semibold text-gray-800 flex-1 mr-4"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {params.type === "drop"
              ? dropOffLocation.placeName
              : pickUpLocation.placeName}
          </Text>
          <Pressable
            className="border border-blue-500 rounded-md px-3 py-1"
            onPress={() => {
              router.push("/(app)/(tabs)/(home)/search");
            }}
          >
            <Text className="text-blue-500 font-semibold">Change</Text>
          </Pressable>
        </View>

        {/* Formik Form */}
        <Formik
          initialValues={{
            houseApartment: "",
            name: "",
            phoneNumber: "",
            addressType: "",
            otherName: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const payload = {
              phoneNumber: values.phoneNumber,
              name: values.name,
              houseNumberPlate: values.houseApartment,
              addressType: values.addressType,
              ...(values.addressType === "Other" && {
                otherName: values.otherName,
              }),
            };

            if (params.type === "drop") {
              dispatch(setDropoffLocation({ ...dropOffLocation, ...payload }));
            } else {
              dispatch(setPickupLocation({ ...pickUpLocation, ...payload }));
            }

            setSubmitting(false);

            if (pickUpLocation.placeName && dropOffLocation.placeName) {
              router.push("/(app)/(tabs)/(home)/checkout");
            } else {
              router.push("/(app)/(tabs)/(home)/search");
            }
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
            isSubmitting,
          }) => (
            <View className="flex gap-4">
              {/* House/Apartment (Optional) */}
              <Input
                className="border border-gray-300 p-3 rounded-md"
                placeholder="House/Apartment (Optional)"
                value={values.houseApartment}
                onChangeText={handleChange("houseApartment")}
                onBlur={handleBlur("houseApartment")}
              />

              {/* Name */}
              <Input
                className="border border-gray-300 p-3 rounded-md"
                placeholder="Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
              />
              {touched.name && errors.name && (
                <Text className="text-red-500 text-sm">{errors.name}</Text>
              )}

              {/* Phone Number */}
              <Input
                className="border border-gray-300 p-3 rounded-md"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={values.phoneNumber}
                onChangeText={handleChange("phoneNumber")}
                onBlur={handleBlur("phoneNumber")}
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <Text className="text-red-500 text-sm">
                  {errors.phoneNumber}
                </Text>
              )}

              {/* Address Type Checkboxes */}
              <Text className="text-gray-700">Save as:</Text>
              <View className="flex flex-row space-x-4">
                {/* Home Checkbox */}
                <TouchableOpacity
                  className="flex flex-row items-center"
                  onPress={() => {
                    setFieldValue("addressType", "Home");
                    setIsOther(false);
                    setFieldValue("otherName", "");
                  }}
                >
                  <CheckBox
                    value={values.addressType === "Home"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Home");
                      setIsOther(false);
                      setFieldValue("otherName", "");
                    }}
                    color={
                      values.addressType === "Home" ? "#3B82F6" : undefined
                    }
                  />
                  <Text className="ml-2 text-gray-800">Home</Text>
                </TouchableOpacity>

                {/* Shop Checkbox */}
                <TouchableOpacity
                  className="flex flex-row items-center"
                  onPress={() => {
                    setFieldValue("addressType", "Shop");
                    setIsOther(false);
                    setFieldValue("otherName", "");
                  }}
                >
                  <CheckBox
                    value={values.addressType === "Shop"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Shop");
                      setIsOther(false);
                      setFieldValue("otherName", "");
                    }}
                    color={
                      values.addressType === "Shop" ? "#3B82F6" : undefined
                    }
                  />
                  <Text className="ml-2 text-gray-800">Shop</Text>
                </TouchableOpacity>

                {/* Other Checkbox */}
                <TouchableOpacity
                  className="flex flex-row items-center"
                  onPress={() => {
                    setFieldValue("addressType", "Other");
                    setIsOther(true);
                  }}
                >
                  <CheckBox
                    value={values.addressType === "Other"}
                    onValueChange={() => {
                      setFieldValue("addressType", "Other");
                      setIsOther(true);
                    }}
                    color={
                      values.addressType === "Other" ? "#3B82F6" : undefined
                    }
                  />
                  <Text className="ml-2 text-gray-800">Other</Text>
                </TouchableOpacity>
              </View>
              {touched.addressType && errors.addressType && (
                <Text className="text-red-500 text-sm">
                  {errors.addressType}
                </Text>
              )}

              {/* If "Other" is selected, show additional input field */}
              {isOther && (
                <>
                  <Input
                    className="border border-gray-300 p-3 rounded-md"
                    placeholder="Specify address type"
                    value={values.otherName}
                    onChangeText={handleChange("otherName")}
                    onBlur={handleBlur("otherName")}
                  />
                  {touched.otherName && errors.otherName && (
                    <Text className="text-red-500 text-sm">
                      {errors.otherName}
                    </Text>
                  )}
                </>
              )}

              {/* Submit Button */}
              <Pressable
                onPress={() => handleSubmit()}
                disabled={isSubmitting}
                className={`mt-4 p-4 rounded-md items-center ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-500"
                }`}
              >
                <Text className="text-white font-semibold">Submit</Text>
              </Pressable>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}
