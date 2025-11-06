import React, { useEffect, useState } from "react";
import AdminOpportunitiesView from "../../components/AdminOpportunitiesView";
import OpportunityFormView from "../../components/OpportunityFormView";
import UserOpportunitiesView from "../../components/UserOpportunitiesView";
import { useUser } from "../../contexts/UserContext";
import { Opportunity, useOpportunities } from "../../hooks/useOpportunities";
import { geocodeAddress } from "../../utils/geocoding";

// Global reference to modal controls
let globalOpenModal: (() => void) | null = null;

export const openOpportunityModal = () => {
  if (globalOpenModal) {
    globalOpenModal();
  }
};

type FormData = {
  name: string;
  description: string;
  location: string;
  peopleNeeded: string;
  dateTime: string;
  imageUri: string | null;
  coordinates?: { latitude: number; longitude: number };
};

export default function Opportunities() {
  const { isAdmin } = useUser();
  const { opportunities, loading, addOpportunity } = useOpportunities();
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    location: "",
    peopleNeeded: "",
    dateTime: "",
    imageUri: null,
  });

  const openModal = () => setModalVisible(true);

  // Expose openModal globally
  useEffect(() => {
    globalOpenModal = openModal;
    return () => {
      globalOpenModal = null;
    };
  }, []);

  const handleSubmit = async () => {
    // If we have a location but no coordinates, geocode it
    let coordinates = formData.coordinates;

    if (formData.location && !coordinates) {
      const geocodedCoords = await geocodeAddress(formData.location);
      if (geocodedCoords) {
        coordinates = geocodedCoords;
      }
    }

    // Create new opportunity
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      location: formData.location,
      peopleNeeded: formData.peopleNeeded,
      dateTime: formData.dateTime,
      imageUri: formData.imageUri,
      volunteersSignedUp: 0,
      coordinates: coordinates,
    };

    // Add to list using the hook
    await addOpportunity(newOpportunity);

    setModalVisible(false);
    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      peopleNeeded: "",
      dateTime: "",
      imageUri: null,
    });
  };

  // Single return statement with conditional rendering
  if (isAdmin && modalVisible) {
    return (
      <OpportunityFormView
        formData={formData}
        onFormDataChange={setFormData}
        onCancel={() => {
          setModalVisible(false);
          resetForm();
        }}
        onSubmit={handleSubmit}
      />
    );
  }

  if (isAdmin) {
    return (
      <AdminOpportunitiesView opportunities={opportunities} loading={loading} />
    );
  }

  return (
    <UserOpportunitiesView opportunities={opportunities} loading={loading} />
  );
}
