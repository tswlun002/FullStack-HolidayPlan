package com.tour.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.Arrays;
import java.util.Objects;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@ToString
@Table
public class App {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;
    @NonNull
    @Column(name = "app_name")
    private String name;
    @Lob
    @Column(length = 16777215 )
    private byte[] logo;
    @Column(name = "app_logo_format",nullable = false)
    private String logoExtension;
    @Column(name = "app_message")
    private String about;
    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true,cascade = CascadeType.ALL, optional = false)
    private  Contact contact;
    @OneToOne(fetch = FetchType.LAZY, orphanRemoval = true,cascade = CascadeType.ALL, optional = false)
    private Address address ;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof App that)) return false;
        return Objects.equals(name, that.name) && Arrays.equals(logo, that.logo)&&
                Objects.equals(logoExtension, that.logoExtension) && Objects.equals(about, that.about) &&
                Objects.equals(address, that.address);
    }

    @Override
    public int hashCode() {
        int result = Objects.hash(name, about, address, logoExtension);
        result = 31 * result + Arrays.hashCode(logo);
        return result;
    }
}
/*

Hibernate: create table `Addresses` (`id` bigint not null auto_increment, `city` varchar(255) not null, `country` varchar(255) not null, `number` varchar(255), `postalCode` integer not null, `street_name` varchar(255) not null, `suburbs` varchar(255) not null, primary key (`id`)) engine=InnoDB
        2023-08-15T13:39:51.225330539Z Hibernate: create table `App` (`id` bigint not null auto_increment, `app_message` varchar(255), `app_logo` `LONGBLOB`, `app_logo_format` varchar(255) not null, `app_name` varchar(255), `address_id` bigint not null, `contact_id` bigint not null, primary key (`id`)) engine=InnoDB
        2023-08-15T13:39:51.226969285Z 2023-08-15T13:39:51.225Z  WARN 1 --- [           main] o.h.t.s.i.ExceptionHandlerLoggedImpl     : GenerationTarget encountered exception accepting command : Error executing DDL "create table `App` (`id` bigint not null auto_increment, `app_message` varchar(255), `app_logo` `LONGBLOB`, `app_logo_format` varchar(255) not null, `app_name` varchar(255), `address_id` bigint not null, `contact_id` bigint not null, primary key (`id`)) engine=InnoDB" via JDBC Statement
        2023-08-15T13:39:51.226991763Z
        2023-08-15T13:39:51.227004596Z org.hibernate.tool.schema.spi.CommandAcceptanceException: Error executing DDL "create table `App` (`id` bigint not null auto_increment, `app_message` varchar(255), `app_logo` `LONGBLOB`, `app_logo_format` varchar(255) not null, `app_name` varchar(255), `address_id` bigint not null, `contact_id` bigint not null, primary key (`id`)) engine=InnoDB" via JDBC Statement
        2023-08-15T13:39:51.227008247Z 	at org.hibernate.tool.schema.internal.exec.GenerationTargetToDatabase.accept(GenerationTargetToDatabase.java:67) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227011505Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.applySqlString(SchemaCreatorImpl.java:502) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227014207Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.applySqlStrings(SchemaCreatorImpl.java:486) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227017036Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.createFromMetadata(SchemaCreatorImpl.java:363) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227019997Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.performCreation(SchemaCreatorImpl.java:176) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227022721Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:144) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227025163Z 	at org.hibernate.tool.schema.internal.SchemaCreatorImpl.doCreation(SchemaCreatorImpl.java:128) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227028583Z 	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.performDatabaseAction(SchemaManagementToolCoordinator.java:254) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227031144Z 	at org.hibernate.tool.schema.spi.SchemaManagementToolCoordinator.lambda$process$5(SchemaManagementToolCoordinator.java:143) ~[hibernate-core-6.1.7.Final.jar!/:6.1.7.Final]
        2023-08-15T13:39:51.227033853Z 	at java.base/java.util.HashMap.forEach(HashMap.java:1421) ~[na:na]*/
