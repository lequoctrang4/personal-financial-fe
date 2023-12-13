import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from "react-native";

import React, { useState } from "react";

const SearchAccount = ({
  data,
  setSelectAccount,
  setClicked,
  setNum,
  setNumIn,
  setNumOut,
  setFiName,
}: {
  data: any;
  setSelectAccount: any;

  setClicked: any;
  setNum: any;
  setNumIn: any;
  setNumOut: any;
  setFiName?: any;
}) => {
  const [selectBank, setSelectBank] = useState(false);

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView nestedScrollEnabled={true} alwaysBounceVertical={false}>
          <Pressable
            onPress={() => {
              setSelectAccount("Tất cả tài khoản");
              setClicked(false);
              setNum(0);
              setNumIn(0);
              setNumOut(0);
              setSelectBank(true);
              setFiName("");
            }}
            style={({ pressed }: { pressed: boolean }) =>
              pressed && {
                opacity: 0.5,
              }
            }
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                borderBottomWidth: 1,
                borderColor: "#c0c0c0",
                height: 40,
              }}
            >
              <Text style={{ fontFamily: "Exo2_700Bold", fontSize: 16 }}>
                Tất cả tài khoản
              </Text>
            </View>
          </Pressable>
          {data.length ? (
            data.map((item: any, index: any) => {
              return (
                <View
                  style={{
                    marginVertical: 10,
                    borderBottomColor: "gray",
                    borderBottomWidth: 0.25,
                    padding: 15,
                  }}
                  key={index}
                >
                  <Pressable
                    onPress={() => {
                      setSelectAccount(item.account_number);
                      setClicked(false);
                      setNum(0);
                      setNumIn(0);
                      setNumOut(0);
                      setFiName(item.FinancialAccount.FiService.fi_name);
                      // setStopFetchMore(true);
                    }}
                    style={({ pressed }: { pressed: boolean }) =>
                      pressed && { opacity: 0.75 }
                    }
                  >
                    <View
                      style={{
                        alignItems: "flex-start",
                        flexDirection: "row",
                      }}
                    >
                      <Image
                        source={{
                          uri: item.FinancialAccount.FiService.logo,
                        }}
                        style={styles.icon}
                      />
                      <View
                        style={{
                          flexDirection: "column",
                          flex: 1,
                          paddingHorizontal: 10,
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <Text
                            style={{
                              fontSize: 12,
                              overflow: "hidden",
                              fontFamily: "Exo2_600SemiBold",
                            }}
                          >
                            Số tài khoản: {""}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,

                              fontFamily: "Exo2_600SemiBold",
                            }}
                          >
                            {item.account_number}
                          </Text>
                        </View>

                        <Text
                          style={{
                            fontSize: 12,

                            width: "100%",
                            fontFamily: "Exo2_600SemiBold",
                          }}
                        >
                          Chủ tài khoản: {item.account_name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            fontFamily: "Exo2_600SemiBold",
                          }}
                        >
                          Tên ngân hàng: {item.FinancialAccount.FiService.fi_name}
                        </Text>
                      </View>
                    </View>

                    {/* <Text
                      style={{
                        borderColor: "gray",
                        borderWidth: 0.25,
                        height: 0,
                        padding: 10,
                      }}
                    /> */}
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Text> </Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SearchAccount;

const styles = StyleSheet.create({
  icon: {
    width: 60,
    height: 60,
  },
});
