import { View } from "react-native";
import React, { useCallback, useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-native";
import LayoutNotificationStyle from "../Styles/LayoutNotification.scss";
import TabView from "../Include/TabView";

const LayoutNotification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <View style={LayoutNotificationStyle.LayoutNotificationContainer}>
      <TabView />
      <Outlet />
    </View>
  );
};

export default LayoutNotification;
