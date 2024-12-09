import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./ClientSideMap"), {
  ssr: false,
  loading: () => <p>Chargement de la carte...</p>,
});

const MapComponent = (props) => {
  return <DynamicMap {...props} />;
};

export default MapComponent;
