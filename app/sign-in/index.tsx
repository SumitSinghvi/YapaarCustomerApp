import { Pressable, Text, TextInput, View } from "react-native";
import * as Yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import { sendOTP, verifyOTP } from "@/src/services/authAPI";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/src/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function signIn() {
  const dispatch = useDispatch();
  const [otpSent, setOtpSent] = useState<string | boolean>(false);
  const [message, setMessage] = useState("");
  const SignUpSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
    phoneNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Required"),
  });
  const OTPSchema = Yup.object().shape({
    otp: Yup.string()
      .matches(/^[0-9]{4}$/, "OTP must be 6 digits")
      .required("Required"),
  });

  return (
    <View className="flex items-center justify-center gap-4 h-screen">
      <Text className="text-2xl font-semibold">Sign In</Text>
      <Formik
        initialValues={{ name: "", phoneNumber: "" }}
        validationSchema={SignUpSchema}
        onSubmit={async (values) => {
          const res = await sendOTP(values.phoneNumber, values.name);
          setMessage(res.message);
          setOtpSent(values.phoneNumber);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View className="w-[80%] flex gap-2">
            <Text>{message}</Text>
            <TextInput
              className="border border-gray-300 rounded p-2"
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              value={values.name}
              placeholder="Name"
            />
            {errors.name && touched.name && <Text>{errors.name}</Text>}
            <TextInput
              className="border border-gray-300 rounded p-2"
              onChangeText={handleChange("phoneNumber")}
              onBlur={handleBlur("phoneNumber")}
              value={values.phoneNumber}
              placeholder="Phone Number"
            />
            {errors.phoneNumber && touched.phoneNumber && (
              <Text>{errors.phoneNumber}</Text>
            )}
            {!otpSent && (
              <Pressable
                className="bg-blue-400 px-6 mt-2 py-4 rounded-lg"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white font-semibold text-center">
                  Get OTP
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </Formik>
      {otpSent && typeof otpSent === "string" && (
        <Formik
          initialValues={{ otp: "" }}
          validationSchema={OTPSchema}
          onSubmit={async (values) => {
            try {
              const res = await verifyOTP(otpSent, values.otp);
              const { user, token } = res;
              // console.log("user", user);
              dispatch(setCredentials({ user, token }));
              await AsyncStorage.setItem("token", token);
              await AsyncStorage.setItem("user", JSON.stringify(user));
              router.replace("/");
            } catch (error) {
              console.error(error);
              setMessage("Invalid OTP");
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
          }) => (
            <View className="w-[80%] flex gap-2">
              <TextInput
                className="border border-gray-300 rounded p-2"
                onChangeText={handleChange("otp")}
                onBlur={handleBlur("otp")}
                value={values.otp}
                placeholder="OTP"
              />
              {errors.otp && touched.otp && <Text>{errors.otp}</Text>}
              <Pressable
                className="bg-blue-400 px-6 mt-2 py-4 rounded-lg"
                onPress={() => handleSubmit()}
              >
                <Text className="text-white font-semibold text-center">
                  Verify OTP
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}
