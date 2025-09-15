import Header from "@/components/Header";
import Center from "@/components/Center";
import Title from "@/components/Title";

export default function TermsPage() {
  return (
    <>
      <Header />
      <Center>
        <Title>Общи условия</Title>
        <p>
          Настоящите Общи условия уреждат отношенията между Artisan Jewelry и клиентите при
          използване на сайта и сключване на договори от разстояние.
        </p>
        <h3>Поръчки</h3>
        <p>Поръчките се считат за валидни след потвърждение по имейл.</p>
        <h3>Цени и плащания</h3>
        <p>Всички цени са в BGN. Плащане – наложен платеж или онлайн при активиране.</p>
        <h3>Доставка и връщане</h3>
        <p>Доставката се извършва с куриер. Връщане в срок от 14 дни съгласно закона.</p>
      </Center>
    </>
  );
}


